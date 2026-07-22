import { Link } from "react-router-dom";
import type { Category } from "@/types";

// Maps the `icon` string stored on Category (see prisma/seed.ts) to an
// inline SVG + tint pair. Keeping this as a lookup table means adding a
// new category in the DB only needs a matching entry here, not a new
// component.
const ICONS: Record<string, { svg: JSX.Element; tint: string; fg: string }> = {
  food: {
    tint: "#FBE4C8",
    fg: "#B4762A",
    svg: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 10.5c0-3 3.6-5.5 8-5.5s8 2.5 8 5.5" />
        <line x1="3.5" y1="10.5" x2="20.5" y2="10.5" />
        <line x1="3.5" y1="13.5" x2="20.5" y2="13.5" />
        <path d="M4 16.5h16c0 1.7-1.8 3-4 3H8c-2.2 0-4-1.3-4-3z" />
      </svg>
    ),
  },
  bag: {
    tint: "#E7F0EA",
    fg: "#1F4E3C",
    svg: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path d="M5 9h14l-1.5 10a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 9z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </svg>
    ),
  },
  tools: {
    tint: "#DCEBFB",
    fg: "#2F6FB4",
    svg: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 1 5.4-5.4l-2.6 2.6-2-2 2.6-2.6z" />
      </svg>
    ),
  },
  building: {
    tint: "#E9E5FB",
    fg: "#5B4FA0",
    svg: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path d="M3 10l9-7 9 7" />
        <path d="M5 9v11h14V9" />
        <rect x="9.5" y="13" width="5" height="7" />
      </svg>
    ),
  },
};

export function CategoryCard({ category }: { category: Category }) {
  const icon = ICONS[category.icon] ?? ICONS.plate;

  return (
    <Link
      to={`/browse?category=${category.slug}`}
      className="flex-none w-full bg-surface rounded-md p-4 md:p-5 text-center shadow-soft border border-border transition-transform active:scale-95"
    >
      <div
        className="w-11 h-11 rounded-xl mx-auto mb-2.5 flex items-center justify-center"
        style={{ background: icon.tint, color: icon.fg }}
      >
        {icon.svg}
      </div>
      <span className="block text-xs font-semibold">{category.name}</span>
      <small className="text-[10.5px] text-ink-soft">
        {category.placeCount} places
      </small>
    </Link>
  );
}
