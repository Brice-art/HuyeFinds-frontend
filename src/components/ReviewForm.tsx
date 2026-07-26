import { useState } from "react";
import { Link } from "react-router-dom";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

interface ReviewFormProps {
  placeId: string;
  onSubmitted: () => void;
}

export function ReviewForm({ placeId, onSubmitted }: ReviewFormProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="bg-surface border border-border rounded-md px-4 py-3.5 mx-5 lg:mx-0 mb-4 text-sm text-ink-soft">
        <Link to="/login" className="text-primary font-semibold">
          Sign in
        </Link>{" "}
        to leave a review.
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Pick a star rating first.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/reviews", {
        placeId,
        rating,
        comment: comment.trim() || undefined,
      });
      setRating(0);
      setComment("");
      onSubmitted();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const displayRating = hoverRating || rating;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-border rounded-md px-4 py-4 mx-5 lg:mx-0 mb-5 flex flex-col gap-3"
    >
      <div>
        <p className="text-[13px] font-semibold mb-2">Rate this place</p>
        <div
          className="flex items-center gap-1"
          onMouseLeave={() => setHoverRating(0)}
        >
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              className="p-0.5"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill={star <= displayRating ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={star <= displayRating ? 0 : 1.5}
                className="text-accent"
              >
                <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What was it like? (optional)"
        rows={3}
        maxLength={1000}
        className="border border-border rounded-md px-3.5 py-2.5 text-[13px] outline-none focus:border-primary bg-bg resize-none"
      />

      {error && <p className="text-[12.5px] text-heart">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="self-start bg-primary text-white text-[13px] font-semibold px-5 py-2.5 rounded-full disabled:opacity-60"
      >
        {submitting ? "Posting…" : "Post review"}
      </button>
    </form>
  );
}
