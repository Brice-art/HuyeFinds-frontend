interface StarRatingProps {
  rating: number;
  reviewCount?: number;
}

export function StarRating({ rating, reviewCount }: StarRatingProps) {
  const rounded = Math.round(rating);

  if (rating <= 0) {
    return (
      <div className="whitespace-nowrap text-xs text-ink-faint">
        No reviews yet
      </div>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xs text-ink-soft">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={i < rounded ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={i < rounded ? 0 : 1.5}
          className="text-accent"
        >
          <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9" />
        </svg>
      ))}
      <span className="ml-1">
        {rating.toFixed(1)}
        {reviewCount !== undefined && reviewCount > 0
          ? ` (${reviewCount})`
          : ""}
      </span>
    </div>
  );
}
