import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({ placeholder = "Search places…", className = "" }: SearchBarProps) {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    navigate(trimmed ? `/browse?search=${encodeURIComponent(trimmed)}` : "/browse");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center gap-2.5 bg-surface border border-border rounded-full shadow-soft px-4 py-3.5 ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="text-ink-faint flex-shrink-0">
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Search places"
        className="w-full border-none outline-none bg-transparent text-[14.5px] placeholder:text-ink-faint"
      />
    </form>
  );
}
