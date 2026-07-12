import { Link } from "react-router-dom";
import type { Category } from "@/types";

// Maps the `icon` string stored on Category (see prisma/seed.ts) to an
// inline SVG + tint pair. Keeping this as a lookup table means adding a
// new category in the DB only needs a matching entry here, not a new
// component.
const ICONS: Record<string, { svg: JSX.Element; tint: string; fg: string }> = {
  plate: {
    tint: "#FBEEDA",
    fg: "#B4762A",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  basket: {
    tint: "#E7F0EA",
    fg: "#1F4E3C",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M5 9h14l-1.5 10a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 9z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </svg>
    ),
  },
  cross: {
    tint: "#FDEAEA",
    fg: "#B4453A",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M12 8v8M8 12h8" />
        <rect x="3" y="3" width="18" height="18" rx="5" />
      </svg>
    ),
  },
  printer: {
    tint: "#E9EEFB",
    fg: "#3B4FA0",
    svg: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
        <path d="M6 9V3h12v6" />
        <rect x="4" y="9" width="16" height="8" rx="2" />
        <path d="M6 17v4h12v-4" />
      </svg>
    ),
  },
};

export function CategoryCard({ category }: { category: Category }) {
  const icon = ICONS[category.icon] ?? ICONS.plate;

  return (
    <Link
      to={`/browse?category=${category.slug}`}
      className="flex-none w-[104px] md:w-auto bg-surface rounded-md p-4 md:p-5 text-center shadow-soft border border-border transition-transform active:scale-95"
    >
      <div
        className="w-11 h-11 rounded-xl mx-auto mb-2.5 flex items-center justify-center"
        style={{ background: icon.tint, color: icon.fg }}
      >
        {icon.svg}
      </div>
      <span className="block text-xs font-semibold">{category.name}</span>
      <small className="text-[10.5px] text-ink-soft">{category.placeCount} places</small>
    </Link>
  );
}
