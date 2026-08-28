import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useCategories } from "@/hooks/useApi";
import { CategoryDropdown } from "./CategoryDropdown";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const { user, logout } = useAuth();
  const { data: categories } = useCategories();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isStudentsHub = location.pathname.startsWith("/students-hub");
  const brandBadgeClass = isStudentsHub
    ? "w-[30px] h-[30px] rounded-[9px] bg-white text-primary-dark flex items-center justify-center font-display font-bold text-base"
    : "w-[30px] h-[30px] rounded-[9px] bg-primary text-accent flex items-center justify-center font-display font-bold text-base";
  const primaryBtnClass = isStudentsHub
    ? "hidden lg:flex items-center gap-2 bg-white text-primary-dark text-[13px] font-semibold px-6 py-2.5 rounded-full"
    : "hidden lg:flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-6 py-2.5 rounded-full";
  const smallCtaClass = isStudentsHub
    ? "px-6 py-2.5 bg-white text-primary-dark rounded-sm"
    : "px-6 py-2.5 text-accent bg-primary hover:text-primary hover:bg-accent rounded-sm";
  const iconBgClass = isStudentsHub
    ? "hidden lg:flex w-[38px] h-[38px] rounded-full bg-white/20 text-white items-center justify-center"
    : "hidden lg:flex w-[38px] h-[38px] rounded-full bg-surface shadow-soft items-center justify-center";
  const mobileBtnClass = isStudentsHub
    ? "lg:hidden w-[38px] h-[38px] rounded-full bg-white/20 text-white flex items-center justify-center"
    : "lg:hidden w-[38px] h-[38px] rounded-full bg-surface shadow-soft flex items-center justify-center";

  return (
    <div
      className={`flex items-center justify-between px-5 py-4 md:px-10 md:py-5 ${isStudentsHub ? "absolute top-0 left-0 right-0 z-20 bg-transparent text-white backdrop-blur-sm" : ""}`}
    >
      <Link to="/" className="flex items-center gap-2 font-bold text-[17px]">
        <span className={brandBadgeClass}>
          H
        </span>
        Huye&nbsp;Finds
      </Link>

      <nav className="hidden lg:flex items-center gap-7 font-semibold" style={{ color: isStudentsHub ? "white" : undefined }}>
        {categories?.items.map((category) => (
          <CategoryDropdown key={category.id} category={category} />
        ))}
        <Link to="/students-hub" className={smallCtaClass}>
          Students Hub
        </Link>
      </nav>

      <div className="flex items-center gap-2.5">
        {user?.role === "OWNER" || user?.role === "ADMIN" ? (
          <Link
            to="/places/new"
            className={`hidden lg:flex items-center gap-1.5 text-[13px] font-semibold px-3 py-2 ${isStudentsHub ? "text-white" : "text-primary"}`}
          >
            + Add a place
          </Link>
        ) : null}
        {user ? (
          <button
            onClick={logout}
            className={primaryBtnClass}
          >
            Sign out
          </button>
        ) : (
          <Link
            to="/login"
            state={{ from: location }}
            className={primaryBtnClass}
          >
            Sign in
          </Link>
        )}

        <Link
          to="/favorites"
          aria-label="Favorites"
          className={iconBgClass}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          className={mobileBtnClass}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories?.items ?? []}
        user={user}
        onLogout={logout}
      />
    </div>
  );
}
