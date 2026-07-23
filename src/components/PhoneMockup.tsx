import { ReactNode } from "react";

export function PhoneMockup({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-[300px] mx-auto">
      <div className="relative rounded-[46px] border-[10px] border-[#C7CCD2] bg-gradient-to-br from-[#F1F2F4] via-[#C9CED4] to-[#A6ACB3] p-1.5 shadow-[0_30px_60px_-20px_rgba(21,58,44,0.45)]">
        {/* Dynamic-island style notch, with a faint camera lens dot */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-ink rounded-full z-20 flex items-center justify-end pr-3">
          <div className="w-2 h-2 rounded-full bg-[#2A3A45]" />
        </div>

        <div className="relative rounded-[36px] overflow-hidden bg-bg aspect-[9/19.5]">
          <div className="flex items-center justify-between px-6 pt-3.5 pb-1 text-[11px] font-semibold text-ink relative z-10">
            <span>
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </span>
            <div className="flex items-center gap-1">
              <svg
                width="14"
                height="10"
                viewBox="0 0 16 12"
                fill="currentColor"
              >
                <rect x="0" y="7" width="3" height="5" rx="0.5" />
                <rect x="4.5" y="4" width="3" height="8" rx="0.5" />
                <rect x="9" y="1" width="3" height="11" rx="0.5" />
              </svg>
              <div>4G</div>
              <svg
                width="16"
                height="11"
                viewBox="0 0 20 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <rect x="0.5" y="0.5" width="16" height="10" rx="2.5" />
                <rect
                  x="2"
                  y="2"
                  width="12"
                  height="7"
                  rx="1.2"
                  fill="currentColor"
                />
                <rect
                  x="17.5"
                  y="4"
                  width="2"
                  height="4"
                  rx="1"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          <div className="px-4 pb-4 h-full overflow-hidden">{children}</div>
        </div>
      </div>
    </div>
  );
}
