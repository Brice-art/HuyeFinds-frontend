import { FormEvent, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import type { HubPostType } from "@/types";

const TYPE_OPTIONS: { value: HubPostType; label: string }[] = [
  { value: "SIDE_HUSTLE", label: "Side Hustle" },
  { value: "LOST_FOUND", label: "Lost & Found" },
  { value: "EVENT", label: "Event" },
  { value: "ANNOUNCEMENT", label: "Announcement" },
];

const inputClass =
  "w-full border border-border rounded-md px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-surface";
const labelClass = "block text-[13px] font-semibold text-ink mb-1.5";

export function CreateHubPostPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [type, setType] = useState<HubPostType>("ANNOUNCEMENT");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await api.post("/hub-posts", {
        type,
        title,
        description,
        contactPhone: contactPhone.trim() || undefined,
        location: location.trim() || undefined,
        eventDate: type === "EVENT" && eventDate ? eventDate : undefined,
      });
      navigate("/students-hub");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-5 py-8 md:py-12">
      <h1 className="font-display text-2xl font-semibold mb-1">
        New Students Hub post
      </h1>
      <p className="text-sm text-ink-soft mb-7">
        Side hustles, lost & found, events, or announcements — visible to every
        student.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className={labelClass}>Type</label>
          <div className="grid grid-cols-2 gap-2">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value)}
                className={`text-[13px] font-semibold py-2.5 rounded-md border ${
                  type === opt.value
                    ? "bg-primary text-white border-primary"
                    : "bg-surface text-ink-soft border-border"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            id="title"
            type="text"
            minLength={3}
            maxLength={120}
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              type === "LOST_FOUND"
                ? "e.g. Lost blue backpack near library"
                : type === "SIDE_HUSTLE"
                  ? "e.g. Fixing laptops, 3000 RWF/hour"
                  : type === "EVENT"
                    ? "e.g. Campus talent show"
                    : "e.g. Library closed this weekend"
            }
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            rows={5}
            minLength={10}
            maxLength={2000}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>

        {type === "EVENT" && (
          <div>
            <label htmlFor="eventDate" className={labelClass}>
              Event date
            </label>
            <input
              id="eventDate"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className={`${inputClass} font-mono`}
            />
          </div>
        )}

        <div>
          <label htmlFor="location" className={labelClass}>
            Location (optional)
          </label>
          <input
            id="location"
            type="text"
            maxLength={160}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Near Main Gate"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="contactPhone" className={labelClass}>
            Contact phone (optional)
          </label>
          <input
            id="contactPhone"
            type="tel"
            maxLength={20}
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="+250 7xx xxx xxx"
            className={`${inputClass} font-mono`}
          />
        </div>

        {error && <p className="text-sm text-heart -mt-2">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-primary text-white font-semibold text-sm py-3.5 rounded-full disabled:opacity-60"
        >
          {submitting ? "Posting…" : "Post to Students Hub"}
        </button>
      </form>
    </div>
  );
}
