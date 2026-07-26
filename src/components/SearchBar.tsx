import { useEffect, useRef, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { cld } from "@/lib/cloudinaryUrl";
import type { PlaceSummary } from "@/types";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 300;
const PREVIEW_LIMIT = 5;

export function SearchBar({
  placeholder = "Search places…",
  className = "",
}: SearchBarProps) {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<PlaceSummary[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed.length < MIN_QUERY_LENGTH) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(() => {
      api
        .get<{ items: PlaceSummary[] }>(
          `/places?search=${encodeURIComponent(trimmed)}&limit=${PREVIEW_LIMIT}`,
        )
        .then((res) => setResults(res.items))
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function goToFullResults(query: string) {
    setOpen(false);
    navigate(query ? `/browse?search=${encodeURIComponent(query)}` : "/browse");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    goToFullResults(value.trim());
  }

  function handleSelectResult(slug: string) {
    setOpen(false);
    navigate(`/places/${slug}`);
  }

  const showDropdown = open && value.trim().length >= MIN_QUERY_LENGTH;

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2.5 bg-surface border border-border rounded-full shadow-soft px-4 py-3.5"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className="text-ink-faint flex-shrink-0"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          aria-label="Search places"
          className="w-full border-none outline-none bg-transparent text-[14.5px] placeholder:text-ink-faint"
        />
      </form>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-lift py-2 z-50 max-h-[70vh] overflow-y-auto">
          {loading && (
            <p className="px-4 py-3 text-[13px] text-ink-faint">Searching…</p>
          )}

          {!loading && results?.length === 0 && (
            <p className="px-4 py-3 text-[13px] text-ink-faint">
              No places matched "{value.trim()}".
            </p>
          )}

          {!loading &&
            results?.map((place) => (
              <button
                key={place.id}
                onClick={() => handleSelectResult(place.slug)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-primary-tint"
              >
                <img
                  src={cld(
                    place.images[0]?.url ??
                      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80",
                    100,
                  )}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover flex-none"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-semibold truncate">
                    {place.name}
                  </div>
                  <div className="text-[11.5px] text-ink-faint truncate">
                    {place.subcategory.name} · {place.landmark}
                  </div>
                </div>
              </button>
            ))}

          {!loading && results && results.length > 0 && (
            <button
              onClick={() => goToFullResults(value.trim())}
              className="w-full text-left px-4 py-2.5 text-[12.5px] font-semibold text-primary border-t border-border mt-1"
            >
              See all results for "{value.trim()}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}
