import { Link } from "react-router-dom";
import { StarRating } from "./StarRating";
import { FavoriteButton } from "./FavoriteButton";
import { ShareButton } from "./ShareButton";
import { useFavoriteToggle } from "@/hooks/useFavoriteToggle";
import type { PlaceSummary } from "@/types";
import { cld } from "@/lib/cloudinaryUrl";

interface PlaceCardProps {
  place: PlaceSummary;
  variant?: "grid" | "rail";
}

export function PlaceCard({ place, variant = "grid" }: PlaceCardProps) {
  const cover = cld(
    place.images[0]?.url ??
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80",
    400,
  );
  const { favorited, toggle } = useFavoriteToggle(place.id, place.isFavorited);
  const isRail = variant === "rail";

  return (
    <Link
      to={`/places/${place.slug}`}
      className={
        (isRail ? "flex-none w-[240px] md:w-[266px]" : "w-full") +
        " group flex flex-col gap-2"
      }
    >
      <div className="relative aspect-square overflow-hidden rounded-xl">
        <img
          src={cover}
          alt={place.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <div onClick={(e) => e.preventDefault()}>
            <ShareButton
              variant="inline"
              title={place.name}
              description={`${place.subcategory.name} · ${place.landmark}`}
              path={`/places/${place.slug}`}
            />
          </div>
          <div onClick={(e) => e.preventDefault()}>
            <FavoriteButton favorited={favorited} onToggle={toggle} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 px-0.5">
        <div className="flex items-start justify-between gap-2 min-w-0">
          <h3 className="min-w-0 flex-1 text-[14px] font-medium leading-snug truncate">
            {place.name}
          </h3>
          <div className="shrink-0">
            <StarRating
              rating={Number(place.ratingAvg)}
              reviewCount={place.reviewCount}
            />
          </div>
        </div>
        <p className="text-[13px] text-ink-faint truncate">{place.landmark}</p>
        <p className="text-[13px] mt-0.5">
          <span className="font-semibold">
            {place.priceMin === place.priceMax
              ? `RWF ${place.priceMin.toLocaleString()}`
              : `RWF ${place.priceMin.toLocaleString()}–${place.priceMax.toLocaleString()}`}
          </span>
        </p>
      </div>
    </Link>
  );
}
