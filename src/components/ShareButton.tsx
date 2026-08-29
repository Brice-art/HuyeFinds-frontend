import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdContentCopy, MdShare, MdWhatsapp } from "react-icons/md";

import {
  copySharePayload,
  shareContent,
  shareViaWhatsApp,
  type SharePayload,
} from "@/lib/share";

type ShareButtonProps = SharePayload & {
  className?: string;
  /** Overlay style for cards with images */
  variant?: "overlay" | "inline" | "pill";
};

export function ShareButton({
  title,
  description,
  path,
  className = "",
  variant = "overlay",
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement | null>(null);
  const [portalPos, setPortalPos] = useState<{ top: number; left: number } | null>(null);

  const payload: SharePayload = { title, description, path };

  useEffect(() => {
    if (!open) return;

    function updatePos() {
      const el = menuRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPortalPos({ top: rect.bottom, left: rect.left });
    }

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        (menuRef.current && menuRef.current.contains(target)) ||
        (portalRef.current && portalRef.current.contains(target))
      ) {
        return;
      }

      setOpen(false);
    }

    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
      document.removeEventListener("mousedown", handleClickOutside);
      setPortalPos(null);
    };
  }, [open]);

  useEffect(() => {
    if (!feedback) return;

    const timeout = window.setTimeout(() => setFeedback(null), 2000);
    return () => window.clearTimeout(timeout);
  }, [feedback]);

  function handleTriggerClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen((current) => !current);
  }

  async function handleWhatsApp(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
    await shareViaWhatsApp(payload);
  }

  async function handleCopy(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
    await copySharePayload(payload);
    setFeedback("Copied!");
  }

  async function handleNativeShare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);

    try {
      const result = await shareContent(payload);
      setFeedback(result === "shared" ? "Shared!" : "Copied!");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setFeedback("Couldn't share");
    }
  }

  const triggerClass =
    variant === "overlay"
      ? `flex h-9 w-9 items-center justify-center rounded-full border border-white/40 text-white backdrop-blur-md transition-all duration-200 active:scale-90 ${
          open ? "bg-black/90" : "bg-black/20 hover:bg-black/40"
        }`
      : variant === "pill"
        ? "inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-white/80 px-3 py-1.5 text-[10.5px] font-semibold text-primary shadow-sm backdrop-blur-sm transition-colors hover:text-primary-dark"
        : "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink-soft shadow-md transition-colors hover:text-primary";

  return (
    <div ref={menuRef} className={`relative z-1 ${className}`}>
      <button
        type="button"
        onClick={handleTriggerClick}
        aria-label="Share"
        aria-expanded={open}
        className={triggerClass}
      >
        <MdShare size={variant === "overlay" ? 19 : 15} />
        {variant === "pill" && "Share"}
      </button>

      {feedback && (
        <span className="pointer-events-none absolute -bottom-8 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold text-white shadow-md">
          {feedback}
        </span>
      )}

      {open && portalPos &&
        createPortal(
          <div
            ref={(el) => (portalRef.current = el)}
            role="menu"
            style={{ position: "fixed", top: portalPos.top, left: portalPos.left }}
            className="z-50 mt-1.5 min-w-[148px] overflow-hidden rounded-xl border border-border py-1 shadow-lift bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              role="menuitem"
              onClick={handleWhatsApp}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12px] font-medium text-ink transition-colors hover:bg-accent-tint"
            >
              <MdWhatsapp size={17} className="text-[#25D366]" />
              WhatsApp
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handleCopy}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12px] font-medium text-ink transition-colors hover:bg-accent-tint"
            >
              <MdContentCopy size={15} className="text-ink-faint" />
              Copy link
            </button>

            {typeof navigator !== "undefined" && "share" in navigator && (
              <button
                type="button"
                role="menuitem"
                onClick={handleNativeShare}
                className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[12px] font-medium text-ink transition-colors hover:bg-accent-tint"
              >
                <MdShare size={15} className="text-ink-faint" />
                More options
              </button>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
