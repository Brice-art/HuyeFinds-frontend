import { NavLink } from "react-router-dom";

const items = [
  {
    to: "/home",
    label: "Home",
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M3 12l9-9 9 9" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    to: "/favorites",
    label: "Favorites",
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    ),
  },
  {
    to: "/browse",
    label: "Search",
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    to: "/students-hub",
    label: "Student Hub",
    icon: (
      <svg
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M22 10 12 5 2 10l10 5 10-5z" />
        <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
      </svg>
    ),
  },
];

export function BottomNav() {
  return (
    <nav className="lg:hidden sticky bottom-0 z-50 flex bg-surface border-t border-border px-1.5 pt-2 pb-[calc(env(safe-area-inset-bottom)+9px)] shadow-[0_-8px_20px_-14px_rgba(32,29,26,0.35)]">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-1.5 ${isActive ? "text-primary" : "text-ink-faint"}`
          }
          end={item.to === "/home"}
        >
          {item.icon}
          <span className="text-[10.5px] font-semibold">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
