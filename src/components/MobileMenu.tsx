import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import type { Category, User } from "@/types";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  user: User | null;
  onLogout: () => void;
}

export function MobileMenu({
  open,
  onClose,
  categories,
  user,
  onLogout,
}: MobileMenuProps) {
  const location = useLocation();
  const isStudentsHub = location.pathname.startsWith("/students-hub");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      <div
        className="absolute inset-0 bg-ink/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={`absolute top-0 right-0 h-full w-[85%] max-w-sm shadow-lift flex flex-col animate-slideIn ${isStudentsHub ? "bg-[#f8f4ee] text-primary-dark" : "bg-bg text-ink"}`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b flex-none ${isStudentsHub ? "border-[#e7dbca]" : "border-border"}`}>
          <span className="font-display font-bold text-[16px]">Menu</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <SearchBar className="mb-5" />

          <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint mb-2">
            Categories
          </p>
          <div className="flex flex-col mb-4">
            {categories.map((category) => {
              const isExpanded = expandedId === category.id;
              return (
                <div key={category.id} className="border-b border-border">
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : category.id)
                    }
                    aria-expanded={isExpanded}
                    className="w-full flex items-center justify-between py-3 text-[14.5px] font-semibold"
                  >
                    {category.name}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className={`transition-transform text-ink-faint ${isExpanded ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {isExpanded && (
                    <div className="pb-2.5 flex flex-col">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          to={`/browse?subcategory=${sub.slug}`}
                          onClick={onClose}
                          className="flex items-center justify-between py-2 pl-2 text-[13.5px] text-ink-soft"
                        >
                          {sub.name}
                          <span className="text-[11px] text-ink-faint">
                            {sub.placeCount}
                          </span>
                        </Link>
                      ))}
                      <Link
                        to={`/browse?category=${category.slug}`}
                        onClick={onClose}
                        className="py-2 pl-2 text-[12.5px] font-semibold text-primary"
                      >
                        View all {category.name}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Link
            to="/students-hub"
            onClick={onClose}
            className="block py-2.5 text-[14.5px] font-semibold border-b border-border"
          >
            Students Hub
          </Link>

          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              onClick={onClose}
              className="block py-2.5 text-[14.5px] font-semibold text-primary border-b border-border"
            >
              Admin dashboard
            </Link>
          )}

          {(user?.role === "OWNER" || user?.role === "ADMIN") && (
            <Link
              to="/places/new"
              onClick={onClose}
              className="block py-2.5 text-[14.5px] font-semibold text-primary border-b border-border"
            >
              + Add a place
            </Link>
          )}

          <Link
            to="/favorites"
            onClick={onClose}
            className="flex items-center gap-2 py-2.5 text-[14.5px] font-semibold border-b border-border"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
            Favorites
          </Link>
        </div>

        <div className="flex-none px-5 py-4 border-t border-border">
          {user ? (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className={`w-full text-[13.5px] font-semibold py-3 rounded-full ${isStudentsHub ? "bg-[#fffaf2] text-primary-dark border border-[#e7dbca]" : "bg-primary text-white"}`}
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              state={{ from: location }}
              onClick={onClose}
              className={`block text-center w-full text-[13.5px] font-semibold py-3 rounded-full ${isStudentsHub ? "bg-[#fffaf2] text-primary-dark border border-[#e7dbca]" : "bg-primary text-white"}`}
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
