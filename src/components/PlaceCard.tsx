import { useNavigate } from "react-router-dom";
import { PriceTag } from "./PriceTag";
import { StarRating } from "./StarRating";
import { FavoriteButton } from "./FavoriteButton";
import { ShareButton } from "./ShareButton";
import { useFavoriteToggle } from "@/hooks/useFavoriteToggle";
import type { PlaceSummary } from "@/types";
import { cld } from "@/lib/cloudinaryUrl";

interface PlaceCardProps {
  place: PlaceSummary;
  // "rail": always the fixed-width vertical card — used inside
  // horizontal-scrolling carousels (Featured Places, Similar Places),
  // where cards must stay a constant width regardless of screen size or
  // the scroll interaction breaks.
  // "grid" (default): a full-width horizontal list row below the `sm`
  // breakpoint (image left, content right), becoming the normal vertical
  // card at `sm` and up — used inside actual CSS grid listings (Browse,
  // Favorites, Popular Places).
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
  const navigate = useNavigate();

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(`/places/${place.slug}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") navigate(`/places/${place.slug}`);
      }}
      className={
        (isRail
          ? "flex-none w-[240px] md:w-[266px] bg-surface rounded-lg overflow-hidden shadow-soft border border-border flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lift"
          : "w-full bg-surface rounded-lg overflow-hidden shadow-soft border border-border flex flex-row sm:flex-col transition-transform hover:-translate-y-1 hover:shadow-lift") +
        " cursor-pointer"
      }
    >
      <div
        className={
          isRail
            ? "relative aspect-[4/3] overflow-hidden"
            : "relative w-28 flex-none overflow-hidden sm:w-full sm:aspect-[4/3] sm:flex-auto"
        }
      >
        <img
          src={cover}
          alt={place.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        <span className="hidden sm:block absolute bottom-2.5 left-2.5 bg-ink/70 text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {place.subcategory.name}
        </span>
        <div className="absolute top-2 right-2 flex items-center gap-1.5 sm:top-2.5 sm:right-2.5">
          <ShareButton
            variant="inline"
            title={place.name}
            description={`${place.subcategory.name} · ${place.landmark}`}
            path={`/places/${place.slug}`}
          />
          <FavoriteButton
            favorited={favorited}
            onToggle={toggle}
          />
        </div>
      </div>

      <div className="p-3 sm:p-3.5 flex flex-col gap-1.5 flex-1 min-w-0 justify-center sm:justify-start">
        <h3 className="text-[14px] sm:text-[15px] font-semibold leading-snug truncate">
          {place.name}
        </h3>
        <StarRating
          rating={Number(place.ratingAvg)}
          reviewCount={place.reviewCount}
        />
        <p className="text-[11.5px] text-ink-faint truncate">
          {place.landmark}
        </p>

        <div className="flex items-center justify-between mt-1.5 gap-2">
          <PriceTag min={place.priceMin} max={place.priceMax} />
          <span className="text-xs font-semibold text-primary bg-primary-tint px-3.5 py-2 rounded-full transition-colors flex-none">View Details</span>
        </div>
      </div>
    </div>
  );
}
