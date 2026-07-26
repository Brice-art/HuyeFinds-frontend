import { FormEvent, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { ImageUpload, StagedImage } from "@/components/ImageUpload";
import { MenuItemsEditor, DraftMenuItem } from "@/components/MenuItemsEditor";
import {
  BusinessHoursEditor,
  DraftHour,
  createDefaultHours,
} from "@/components/BusinessHoursEditor";
import type { Category } from "@/types";

interface CreatedPlace {
  slug: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function titleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .map((word) =>
      word.length > 0
        ? word[0].toUpperCase() + word.slice(1).toLowerCase()
        : word,
    )
    .join(" ");
}

const inputClass =
  "w-full border border-border rounded-md px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-surface";
const labelClass = "block text-[13px] font-semibold text-ink mb-1.5";

export function CreatePlacePage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [landmark, setLandmark] = useState("");

  const [menuItems, setMenuItems] = useState<DraftMenuItem[]>([]);
  const [hours, setHours] = useState<DraftHour[]>(createDefaultHours());
  const [includeHours, setIncludeHours] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [imageState, setImageState] = useState<{
    images: StagedImage[];
    isUploading: boolean;
    hasFailed: boolean;
  }>({ images: [], isUploading: false, hasFailed: false });

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);

  useEffect(() => {
    api
      .get<{ items: Category[] }>("/categories")
      .then((res) => setCategories(res.items))
      .catch(() => setCategories([]));
  }, []);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  function handleCategoryChange(value: string) {
    setCategoryId(value);
    setSubcategoryId("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (imageState.isUploading) {
      setError("Wait for photo uploads to finish before creating the place.");
      return;
    }
    if (imageState.hasFailed) {
      setError("Remove or retry the failed photo before creating the place.");
      return;
    }
    if (!subcategoryId) {
      setError("Select a category and subcategory.");
      return;
    }

    setSubmitting(true);
    try {
      console.log(imageState.images);
      const place = await api.post<CreatedPlace>("/places", {
        name: titleCase(name),
        slug,
        description,
        subcategoryId,
        priceMin: Number(priceMin),
        priceMax: Number(priceMax),
        contactPhone,
        landmark,
        images: imageState.images,
        menuItems: menuItems.length
          ? menuItems.map((m) => ({
              name: m.name,
              price: Number(m.price),
              note: m.note || undefined,
            }))
          : undefined,
        hours: includeHours
          ? hours.map((h) => ({
              dayOfWeek: h.dayOfWeek,
              isClosed: h.isClosed,
              openTime: h.isClosed ? undefined : h.openTime,
              closeTime: h.isClosed ? undefined : h.closeTime,
            }))
          : undefined,
      });
      navigate(`/places/${place.slug}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setName("");
    setSlug("");
    setSlugTouched(false);
    setDescription("");
    setCategoryId("");
    setSubcategoryId("");
    setPriceMin("");
    setPriceMax("");
    setContactPhone("");
    setLandmark("");
    setMenuItems([]);
    setHours(createDefaultHours());
    setIncludeHours(false);
    setError(null);
  }

  if (authLoading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "OWNER" && user.role !== "ADMIN") {
    return (
      <div className="max-w-md mx-auto px-5 py-16 text-center">
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="font-display text-xl font-semibold mb-2">
          Business accounts only
        </h1>
        <p className="text-sm text-ink-soft leading-relaxed">
          Adding a place is limited to business owner accounts for now. If you
          run a place near campus and want it listed, reach out and we'll get
          you set up.
        </p>
      </div>
    );
  }

  const submitDisabled = submitting || imageState.isUploading;

  return (
    <div className="max-w-xl mx-auto px-5 py-8 md:py-12">
      <h1 className="font-display text-2xl font-semibold mb-1">
        Create a new place
      </h1>
      <p className="text-sm text-ink-soft mb-7">
        Add your business so students can find you. Photos, menu, and hours are
        optional but help a lot.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label htmlFor="name" className={labelClass}>
            Place name
          </label>
          <input
            id="name"
            type="text"
            placeholder="e.g. Simba Restaurant"
            minLength={2}
            maxLength={120}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>
            Slug
          </label>
          <input
            id="slug"
            type="text"
            placeholder="simba-restaurant"
            pattern="[a-z0-9-]+"
            minLength={2}
            maxLength={140}
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className={`${inputClass} font-mono`}
          />
          <p className="text-xs text-ink-faint mt-1.5">
            Used in the page URL. Auto-filled from the name — edit it directly
            to override.
          </p>
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
            placeholder="What makes this place worth a visit — food, prices, vibe..."
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="categoryId" className={labelClass}>
              Category
            </label>
            <select
              id="categoryId"
              required
              value={categoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={inputClass}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subcategoryId" className={labelClass}>
              Subcategory
            </label>
            <select
              id="subcategoryId"
              required
              disabled={!selectedCategory}
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <option value="">
                {selectedCategory
                  ? "Select a subcategory"
                  : "Pick a category first"}
              </option>
              {selectedCategory?.subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="border border-border rounded-md p-4">
          <legend className="text-[13px] font-semibold px-1.5 -ml-1.5">
            Price range (RWF)
          </legend>
          <div className="grid grid-cols-2 gap-4 mt-1">
            <div>
              <label
                htmlFor="priceMin"
                className="text-xs text-ink-soft mb-1 block"
              >
                Minimum
              </label>
              <input
                id="priceMin"
                type="number"
                min="0"
                step="1"
                required
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className={`${inputClass} font-mono`}
              />
            </div>
            <div>
              <label
                htmlFor="priceMax"
                className="text-xs text-ink-soft mb-1 block"
              >
                Maximum
              </label>
              <input
                id="priceMax"
                type="number"
                min="0"
                step="1"
                required
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className={`${inputClass} font-mono`}
              />
            </div>
          </div>
        </fieldset>

        <div>
          <label htmlFor="contactPhone" className={labelClass}>
            Contact phone
          </label>
          <input
            id="contactPhone"
            type="tel"
            placeholder="+250 7xx xxx xxx"
            minLength={7}
            maxLength={20}
            required
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            className={`${inputClass} font-mono`}
          />
        </div>

        <div>
          <label htmlFor="landmark" className={labelClass}>
            Nearest landmark
          </label>
          <input
            id="landmark"
            type="text"
            placeholder="Near Huye Campus main gate"
            minLength={2}
            maxLength={160}
            required
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Menu (optional)</label>
          <MenuItemsEditor items={menuItems} onChange={setMenuItems} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={`${labelClass} mb-0`}>
              Business hours (optional)
            </label>
            <label className="flex items-center gap-1.5 text-[12px] text-ink-soft">
              <input
                type="checkbox"
                checked={includeHours}
                onChange={(e) => setIncludeHours(e.target.checked)}
                className="accent-primary"
              />
              Add hours
            </label>
          </div>
          {includeHours && (
            <BusinessHoursEditor hours={hours} onChange={setHours} />
          )}
        </div>

        <div>
          <label className={labelClass}>Photos (optional)</label>
          <ImageUpload onStateChange={setImageState} />
        </div>

        {error && <p className="text-sm text-heart -mt-2">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitDisabled}
            className="flex-1 bg-primary text-white font-semibold text-sm py-3.5 rounded-full disabled:opacity-60 transition-opacity"
          >
            {submitting
              ? "Creating…"
              : imageState.isUploading
                ? "Uploading photos…"
                : "Create place"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-3.5 rounded-full border border-border text-sm font-semibold text-ink-soft"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
