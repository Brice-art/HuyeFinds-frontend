import { FormEvent, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams, useLocation } from "react-router-dom";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { ImageUpload, StagedImage } from "@/components/ImageUpload";
import { MenuItemsEditor, DraftMenuItem } from "@/components/MenuItemsEditor";
import { BusinessHoursEditor, DraftHour, createDefaultHours } from "@/components/BusinessHoursEditor";
import { usePlaceDetail } from "@/hooks/useApi";
import type { Category } from "@/types";

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
    .map((word) => (word.length > 0 ? word[0].toUpperCase() + word.slice(1).toLowerCase() : word))
    .join(" ");
}

const inputClass =
  "w-full border border-border rounded-md px-4 py-3 text-sm outline-none focus:border-primary transition-colors bg-surface";
const labelClass = "block text-[13px] font-semibold text-ink mb-1.5";

export function PlaceEditPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: place, loading, error } = usePlaceDetail(slug);

  const [name, setName] = useState("");
  const [slugState, setSlugState] = useState("");
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [imageState, setImageState] = useState<{ images: StagedImage[]; isUploading: boolean; hasFailed: boolean }>({ images: [], isUploading: false, hasFailed: false });
  const [existingImages, setExistingImages] = useState<StagedImage[]>([]);

  useEffect(() => {
    if (!slugTouched) setSlugState(slugify(name));
  }, [name, slugTouched]);

  useEffect(() => {
    api
      .get<{ items: Category[] }>("/categories")
      .then((res) => setCategories(res.items))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!place) return;
    setName(place.name);
    setSlugState(place.slug);
    setDescription(place.description);
    setSubcategoryId(place.subcategory.id);
    setPriceMin(String(place.priceMin));
    setPriceMax(String(place.priceMax));
    setContactPhone(place.contactPhone);
    setLandmark(place.landmark);
    setMenuItems(place.menuItems.map((m) => ({ name: m.name, price: String(m.price), note: m.note ?? "" })));
    setHours(place.hours.length ? place.hours.map((h) => ({ dayOfWeek: h.dayOfWeek, openTime: h.openTime ?? "", closeTime: h.closeTime ?? "", isClosed: h.isClosed })) : createDefaultHours());
    setIncludeHours(place.hours.length > 0);
    setExistingImages(place.images.map((i) => ({ url: i.url, altText: i.altText })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place?.id]);

  // when categories load or place changes, resolve categoryId from category slug
  useEffect(() => {
    if (!place || categories.length === 0) return;
    const cat = categories.find((c) => c.slug === place.subcategory.category.slug);
    setCategoryId(cat?.id ?? "");
    // ensure subcategoryId is set as well
    setSubcategoryId(place.subcategory.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place?.id, categories.length]);

  const location = useLocation();
  if (authLoading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user.role !== "ADMIN") return <p className="px-5 py-6 text-heart">You don't have permission to edit places.</p>;

  const selectedCategory = categories.find((c) => c.id === categoryId);

  function handleCategoryChange(value: string) {
    setCategoryId(value);
    setSubcategoryId("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!slug) return;
    setErrorMsg(null);

    if (imageState.isUploading) {
      setErrorMsg("Wait for photo uploads to finish before saving the place.");
      return;
    }
    if (imageState.hasFailed) {
      setErrorMsg("Remove or retry the failed photo before saving the place.");
      return;
    }
    if (!subcategoryId) {
      setErrorMsg("Select a category and subcategory.");
      return;
    }

    setSubmitting(true);
    try {
      await api.patch(`/places/${slug}`, {
        name: titleCase(name),
        slug: slugState,
        description,
        subcategoryId,
        priceMin: Number(priceMin),
        priceMax: Number(priceMax),
        contactPhone,
        landmark,
        images: [...existingImages, ...imageState.images],
        menuItems: menuItems.length
          ? menuItems.map((m) => ({ name: m.name, price: Number(m.price), note: m.note || undefined }))
          : undefined,
        hours: includeHours
          ? hours.map((h) => ({ dayOfWeek: h.dayOfWeek, isClosed: h.isClosed, openTime: h.isClosed ? undefined : h.openTime, closeTime: h.isClosed ? undefined : h.closeTime }))
          : undefined,
      });
      navigate(`/places/${slugState}`);
    } catch (err) {
      setErrorMsg(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    // keep populated values — Reset to original place
    if (!place) return;
    setName(place.name);
    setSlugState(place.slug);
    setSlugTouched(false);
    setDescription(place.description);
    setCategoryId(place.subcategory.category ? place.subcategory.category.id : "");
    setSubcategoryId(place.subcategory.id);
    setPriceMin(String(place.priceMin));
    setPriceMax(String(place.priceMax));
    setContactPhone(place.contactPhone);
    setLandmark(place.landmark);
    setMenuItems(place.menuItems.map((m) => ({ name: m.name, price: String(m.price), note: m.note ?? "" })));
    setHours(place.hours.length ? place.hours.map((h) => ({ dayOfWeek: h.dayOfWeek, openTime: h.openTime ?? "", closeTime: h.closeTime ?? "", isClosed: h.isClosed })) : createDefaultHours());
    setIncludeHours(place.hours.length > 0);
    setErrorMsg(null);
  }

  if (loading) return <p className="px-5 py-6">Loading…</p>;
  if (error || !place) return <p className="px-5 py-6 text-heart">Couldn't load this place.</p>;

  const submitDisabled = submitting || imageState.isUploading;

  return (
    <div className="max-w-xl mx-auto px-5 py-8 md:py-12">
      <h1 className="font-display text-2xl font-semibold mb-1">Edit place</h1>
      <p className="text-sm text-ink-soft mb-7">Update place details, photos, menu and hours.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label htmlFor="name" className={labelClass}>Place name</label>
          <input id="name" type="text" placeholder="e.g. Simba Restaurant" minLength={2} maxLength={120} required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>Slug</label>
          <input id="slug" type="text" placeholder="simba-restaurant" pattern="[a-z0-9-]+" minLength={2} maxLength={140} required value={slugState} onChange={(e) => { setSlugState(e.target.value); setSlugTouched(true); }} className={`${inputClass} font-mono`} />
          <p className="text-xs text-ink-faint mt-1.5">Used in the page URL. Edit to override.</p>
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>Description</label>
          <textarea id="description" rows={5} minLength={10} maxLength={2000} placeholder="What makes this place worth a visit — food, prices, vibe..." required value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} resize-none`} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="categoryId" className={labelClass}>Category</label>
            <select id="categoryId" required value={categoryId} onChange={(e) => handleCategoryChange(e.target.value)} className={inputClass}>
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="subcategoryId" className={labelClass}>Subcategory</label>
            <select id="subcategoryId" required disabled={!selectedCategory} value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}>
              <option value="">{selectedCategory ? "Select a subcategory" : "Pick a category first"}</option>
              {selectedCategory?.subcategories.map((sub) => (
                <option key={sub.id} value={sub.id}>{sub.name}</option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="border border-border rounded-md p-4">
          <legend className="text-[13px] font-semibold px-1.5 -ml-1.5">Price range (RWF)</legend>
          <div className="grid grid-cols-2 gap-4 mt-1">
            <div>
              <label htmlFor="priceMin" className="text-xs text-ink-soft mb-1 block">Minimum</label>
              <input id="priceMin" type="number" min="0" step="1" required value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className={`${inputClass} font-mono`} />
            </div>
            <div>
              <label htmlFor="priceMax" className="text-xs text-ink-soft mb-1 block">Maximum</label>
              <input id="priceMax" type="number" min="0" step="1" required value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className={`${inputClass} font-mono`} />
            </div>
          </div>
        </fieldset>

        <div>
          <label htmlFor="contactPhone" className={labelClass}>Contact phone</label>
          <input id="contactPhone" type="tel" placeholder="+250 7xx xxx xxx" minLength={7} maxLength={20} required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className={`${inputClass} font-mono`} />
        </div>

        <div>
          <label htmlFor="landmark" className={labelClass}>Nearest landmark</label>
          <input id="landmark" type="text" placeholder="Near Huye Campus main gate" minLength={2} maxLength={160} required value={landmark} onChange={(e) => setLandmark(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Menu (optional)</label>
          <MenuItemsEditor items={menuItems} onChange={setMenuItems} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={`${labelClass} mb-0`}>Business hours (optional)</label>
            <label className="flex items-center gap-1.5 text-[12px] text-ink-soft">
              <input type="checkbox" checked={includeHours} onChange={(e) => setIncludeHours(e.target.checked)} className="accent-primary" />
              Add hours
            </label>
          </div>
          {includeHours && <BusinessHoursEditor hours={hours} onChange={setHours} />}
        </div>

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
          <button type="submit" disabled={submitDisabled} className="flex-1 bg-primary text-white font-semibold text-sm py-3.5 rounded-full disabled:opacity-60 transition-opacity">{submitting ? "Saving…" : imageState.isUploading ? "Uploading photos…" : "Save place"}</button>
          <button type="button" onClick={handleReset} className="px-6 py-3.5 rounded-full border border-border text-sm font-semibold text-ink-soft">Reset</button>
        </div>
      </form>
    </div>
  );
}
