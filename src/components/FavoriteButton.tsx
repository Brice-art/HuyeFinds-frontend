interface FavoriteButtonProps {
  favorited: boolean;
  onToggle: () => void;
  className?: string;
}

// Purely presentational now — state lives in useFavoriteToggle so it can
// be shared across multiple buttons pointing at the same place (e.g. the
// details page's cover-image heart and its sticky footer button).
export function FavoriteButton({ favorited, onToggle, className = "" }: FavoriteButtonProps) {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault(); // stop the click bubbling into a parent <Link>
    e.stopPropagation();
    onToggle();
  }

  return (
    <button
      onClick={handleClick}
      aria-label={favorited ? "Remove from favorites" : "Save to favorites"}
      aria-pressed={favorited}
      className={`w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center ${className}`}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={favorited ? "#C4573F" : "none"}
        stroke={favorited ? "#C4573F" : "currentColor"}
        strokeWidth={2}
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    </button>
  );
}
