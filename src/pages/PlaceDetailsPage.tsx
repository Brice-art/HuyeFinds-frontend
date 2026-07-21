import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PriceTag } from "@/components/PriceTag";
import { StarRating } from "@/components/StarRating";
import { FavoriteButton } from "@/components/FavoriteButton";
import { PlaceCard } from "@/components/PlaceCard";
import { usePlaceDetail, useSimilarPlaces } from "@/hooks/useApi";
import { useFavoriteToggle } from "@/hooks/useFavoriteToggle";

const DAY_LABELS: Record<string, string> = {
  MONDAY: "Monday",
  TUESDAY: "Tuesday",
  WEDNESDAY: "Wednesday",
  THURSDAY: "Thursday",
  FRIDAY: "Friday",
  SATURDAY: "Saturday",
  SUNDAY: "Sunday",
};

export function PlaceDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: place, loading, error } = usePlaceDetail(slug);
  const { data: similar } = useSimilarPlaces(slug);
  const [selectedImage, setSelectedImage] = useState(0);
  // Called unconditionally (before the early returns below) so hook order
  // stays stable across renders — falls back to an empty placeId until
  // `place` loads, which is fine since neither favorite button renders
  // until then anyway.
  const { favorited, toggle } = useFavoriteToggle(
    place?.id ?? "",
    place?.isFavorited ?? false,
  );

  if (loading)
    return (
      <p className="px-5 md:px-10 py-10 text-sm text-ink-faint">Loading…</p>
    );
  if (error || !place)
    return (
      <p className="px-5 md:px-10 py-10 text-sm text-heart">
        Couldn't load this place.
      </p>
    );

  const cover = place.images[selectedImage]?.url ?? place.images[0]?.url;

  return (
    <div className="lg:grid lg:grid-cols-[1.05fr_1fr] lg:gap-11 lg:px-10 lg:pt-6 lg:items-start">
      <div className="lg:sticky lg:top-6">
        <div className="relative lg:rounded-3xl lg:overflow-hidden">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="lg:hidden absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/95 shadow-soft flex items-center justify-center"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="absolute top-4 right-4 z-10">
            <FavoriteButton
              favorited={favorited}
              onToggle={toggle}
              className="w-10 h-10"
            />
          </div>
          <img
            src={cover}
            alt={place.name}
            className="w-full aspect-[5/4] lg:aspect-[4/3.3] lg:rounded-3xl object-cover"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto px-5 lg:px-0 py-3">
          {place.images.map((img, i) => (
            <button key={img.id} onClick={() => setSelectedImage(i)}>
              <img
                src={img.url}
                alt={img.altText}
                className={`w-[74px] h-[74px] rounded-xl object-cover flex-none border-2 ${
                  i === selectedImage ? "border-accent" : "border-transparent"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="lg:min-w-0">
        <div className="px-5 lg:px-0 pt-2 pb-1">
          <p className="text-xs text-ink-faint mb-2">
            {place.subcategory.category.name} / {place.subcategory.name} /{" "}
            {place.landmark}
          </p>
          <h1 className="text-[25px] font-semibold mb-2">{place.name}</h1>
          <div className="flex items-center gap-2 flex-wrap mb-3.5">
            <span className="text-[11.5px] font-semibold text-primary bg-primary-tint px-3 py-1.5 rounded-full">
              {place.subcategory.name}
            </span>
            <PriceTag min={place.priceMin} max={place.priceMax} size="lg" />
          </div>
          <StarRating
            rating={Number(place.ratingAvg)}
            reviewCount={place.reviewCount}
          />
        </div>

        <div className="flex items-center justify-between bg-surface border border-border rounded-md px-4 py-3.5 mx-5 lg:mx-0 my-4 shadow-soft">
          <div>
            <div className="text-[11px] text-ink-soft mb-0.5">
              Call to ask about today's menu
            </div>
            <div className="font-mono text-sm font-semibold">
              {place.contactPhone}
            </div>
          </div>
          <a
            href={`tel:${place.contactPhone}`}
            className="bg-primary text-white text-xs font-semibold px-4 py-2.5 rounded-full flex items-center gap-1.5"
          >
            Call
          </a>
        </div>

        <p className="px-5 lg:px-0 text-sm text-ink-soft leading-relaxed">
          {place.description}
        </p>

        {place.menuItems.length > 0 && (
          <>
            <hr className="my-5 mx-5 lg:mx-0 border-border" />
            <h2 className="px-5 lg:px-0 text-lg font-semibold mb-3.5">
              Menu highlights
            </h2>
            <div className="px-5 lg:px-0 flex flex-col gap-2.5">
              {place.menuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-surface border border-border rounded-md px-4 py-3"
                >
                  <div>
                    <div className="text-[13.5px] font-semibold">
                      {item.name}
                    </div>
                    {item.note && (
                      <div className="text-[11.5px] text-ink-soft">
                        {item.note}
                      </div>
                    )}
                  </div>
                  <PriceTag
                    label={`${item.price.toLocaleString("en-RW")} RWF`}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {place.hours.length > 0 && (
          <>
            <hr className="my-5 mx-5 lg:mx-0 border-border" />
            <h2 className="px-5 lg:px-0 text-lg font-semibold mb-3.5">
              Business hours
            </h2>
            <div className="px-5 lg:px-0">
              {place.hours.map((h) => (
                <div
                  key={h.dayOfWeek}
                  className="flex justify-between py-2.5 border-b border-border last:border-none text-sm"
                >
                  <span className="font-semibold">
                    {DAY_LABELS[h.dayOfWeek]}
                  </span>
                  <span className="font-mono text-ink-soft">
                    {h.isClosed ? "Closed" : `${h.openTime} – ${h.closeTime}`}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <hr className="my-5 mx-5 lg:mx-0 border-border" />
        <h2 className="px-5 lg:px-0 text-lg font-semibold mb-3.5">
          Student reviews
        </h2>
        {place.reviews.length === 0 && (
          <p className="px-5 lg:px-0 text-sm text-ink-faint mb-2">
            No reviews yet — be the first to leave one.
          </p>
        )}
        {place.reviews.map((r) => (
          <div
            key={r.id}
            className="bg-surface border border-border rounded-md px-4 py-3.5 mx-5 lg:mx-0 mb-3"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-full bg-accent-tint text-primary-dark flex items-center justify-center font-display font-bold text-xs">
                {r.user.name[0]}
              </div>
              <div>
                <div className="text-[13px] font-semibold">{r.user.name}</div>
                <div className="text-[11px] text-ink-faint">
                  {new Date(r.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            {r.comment && (
              <p className="text-[13px] text-ink-soft leading-relaxed">
                {r.comment}
              </p>
            )}
          </div>
        ))}

        {similar && similar.items.length > 0 && (
          <>
            <hr className="my-5 mx-5 lg:mx-0 border-border" />
            <h2 className="px-5 lg:px-0 text-lg font-semibold mb-3.5">
              Similar places nearby
            </h2>
            <div className="flex gap-4 overflow-x-auto px-5 lg:px-0 pb-4">
              {similar.items.map((p) => (
                <PlaceCard key={p.id} place={p} />
              ))}
            </div>
          </>
        )}

        <div className="sticky bottom-0 flex gap-2.5 px-5 lg:px-0 py-3.5 bg-gradient-to-t from-bg to-transparent">
          <FavoriteButton
            favorited={favorited}
            onToggle={toggle}
            className="w-[52px] border border-border !bg-surface"
          />
          <button
            onClick={toggle}
            className="flex-1 bg-primary text-white font-semibold text-sm rounded-full shadow-lift"
          >
            {favorited ? "Saved to Favorites" : "Save to Favorites"}
          </button>
        </div>
      </div>
    </div>
  );
}
