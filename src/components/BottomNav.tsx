import { NavLink } from "react-router-dom";

const items = [
  {
    to: "/home",
    label: "Home",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 12l9-9 9 9" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    to: "/favorites",
    label: "Favorites",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    ),
  },
  {
    to: "/housing",
    label: "Housing",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M9 22V12h6v10" />
        <path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
  {
    to: "/account",
    label: "Account",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
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
