import { FormEvent, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams, useLocation } from "react-router-dom";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { useHubPost } from "@/hooks/useApi";
import { ImageUpload, StagedImage } from "@/components/ImageUpload";
import type { HubPostType } from "@/types";

const TYPE_OPTIONS: { value: HubPostType; label: string }[] = [
  { value: "ANNOUNCEMENT", label: "Announcement" },
  { value: "SIDE_HUSTLE", label: "Side Hustle" },
  { value: "BUY_SELL", label: "Buy & Sell" },
  { value: "LOST_FOUND", label: "Lost & Found" },
  { value: "EVENT", label: "Event" },
];

const inputClass =
  "w-full border border-border rounded-md px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-surface";
const labelClass = "block text-[13px] font-semibold text-ink mb-1.5";

export function HubPostEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: post, loading, error } = useHubPost(id);

  const [type, setType] = useState<HubPostType>("ANNOUNCEMENT");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [imageState, setImageState] = useState<{ images: StagedImage[]; isUploading: boolean; hasFailed: boolean }>({ images: [], isUploading: false, hasFailed: false });
  const [existingImages, setExistingImages] = useState<StagedImage[]>([]);

  const locationPage = useLocation();
  if (authLoading) return null;
  if (!user) return <Navigate to="/login" state={{ from: locationPage }} replace />;

  useEffect(() => {
    if (!post) return;
    setType(post.type);
    setTitle(post.title);
    setDescription(post.description);
    setPrice(post.price != null ? String(post.price) : "");
    setContactPhone(post.contactPhone ?? "");
    setLocation(post.location ?? "");
    setEventDate(post.eventDate ?? "");
    setIsUrgent(Boolean(post.isUrgent));
    setExistingImages(post.images.map((i) => ({ url: i.url, altText: i.altText })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!id) return;
    setErrorMsg(null);

    if (imageState.isUploading) {
      setErrorMsg("Wait for photo uploads to finish before saving.");
      return;
    }
    if (imageState.hasFailed) {
      setErrorMsg("Remove or retry the failed photo before saving.");
      return;
    }

    setSaving(true);
    try {
      const showPrice = type === "BUY_SELL" || type === "SIDE_HUSTLE";
      const payload: any = {
        type,
        title: title.trim(),
        description: description.trim(),
        price: showPrice && price !== "" ? Number(price) : undefined,
        isUrgent,
        contactPhone: contactPhone.trim() || undefined,
        location: location.trim() || undefined,
        eventDate: type === "EVENT" && eventDate ? eventDate : undefined,
        images: [...existingImages, ...imageState.images],
      };

      await api.patch(`/hub-posts/${id}`, payload);
      navigate(`/students-hub/${id}`);
    } catch (err) {
      setErrorMsg(err instanceof ApiError ? err.message : "Couldn't save post");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="px-5 py-6">Loading…</p>;
  if (error || !post) return <p className="px-5 py-6 text-heart">Couldn't load this post.</p>;

  return (
    <div className="max-w-xl mx-auto px-5 py-8 md:py-12">
      <h1 className="font-display text-2xl font-semibold mb-1">Edit Students Hub post</h1>
      <p className="text-sm text-ink-soft mb-7">Edit your post details and photos.</p>

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
                  type === opt.value ? "bg-primary text-white border-primary" : "bg-surface text-ink-soft border-border"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="title" className={labelClass}>Title</label>
          <input id="title" type="text" minLength={3} maxLength={120} required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea id="description" rows={5} minLength={10} maxLength={2000} required value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} resize-none`} />
        </div>

        {(type === "BUY_SELL" || type === "SIDE_HUSTLE") && (
          <div>
            <label htmlFor="price" className={labelClass}>Price (RWF, optional)</label>
            <input id="price" type="number" min="0" step="1" value={price} onChange={(e) => setPrice(e.target.value)} className={`${inputClass} font-mono`} />
          </div>
        )}

        {type === "EVENT" && (
          <div>
            <label htmlFor="eventDate" className={labelClass}>Event date</label>
            <input id="eventDate" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={`${inputClass} font-mono`} />
          </div>
        )}

        <div>
          <label htmlFor="location" className={labelClass}>Location (optional)</label>
          <input id="location" type="text" maxLength={160} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Near Main Gate" className={inputClass} />
        </div>

        <div>
          <label htmlFor="contactPhone" className={labelClass}>Contact phone (optional)</label>
          <input id="contactPhone" type="tel" maxLength={20} value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+250 7xx xxx xxx" className={`${inputClass} font-mono`} />
        </div>

        <label className="flex items-center gap-2 text-[13px] text-ink-soft">
          <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} className="accent-primary" />
          Mark as urgent
        </label>

        <div>
          <label className={labelClass}>Photos (optional)</label>
          <div className="flex gap-2 mb-2">
            {existingImages.map((img, i) => (
              <div key={img.url} className="relative">
                <img src={img.url} alt={img.altText ?? ""} className="w-20 h-20 object-cover rounded" />
                <button type="button" onClick={() => setExistingImages((prev) => prev.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-white/90 text-heart rounded-full p-1">×</button>
              </div>
            ))}
          </div>
          <ImageUpload onStateChange={setImageState} />
        </div>

        {errorMsg && <p className="text-sm text-heart -mt-2">{errorMsg}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving || imageState.isUploading} className="flex-1 bg-primary text-white font-semibold text-sm py-3.5 rounded-full disabled:opacity-60 transition-opacity">{saving ? "Saving…" : imageState.isUploading ? "Uploading photos…" : "Save changes"}</button>
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-3.5 rounded-full border border-border text-sm font-semibold text-ink-soft">Cancel</button>
        </div>
      </form>
    </div>
  );
}
