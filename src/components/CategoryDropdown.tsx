import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Category } from "@/types";

interface CategoryDropdownProps {
  category: Category;
}

// Click-to-toggle, not hover-to-open. Hover-only dropdowns don't work on
// touch devices at all, and they're awkward for keyboard users. Click +
// outside-click + Escape covers all three input methods.
export function CategoryDropdown({ category }: CategoryDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1.5 hover:text-primary"
      >
        {category.name}
        <svg
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-surface border border-border rounded-xl shadow-lift py-2 z-50">
          {category.subcategories.map((sub) => (
            <Link
              key={sub.id}
              to={`/browse?subcategory=${sub.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 text-[13.5px] font-medium text-ink hover:bg-primary-tint hover:text-primary"
            >
              {sub.name}
              <span className="text-[11px] text-ink-faint">{sub.placeCount}</span>
            </Link>
          ))}
          <div className="border-t border-border mt-1.5 pt-1.5">
            <Link
              to={`/browse?category=${category.slug}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-[12.5px] font-semibold text-primary"
            >
              View all {category.name}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}