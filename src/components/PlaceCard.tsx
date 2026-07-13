import { Link } from "react-router-dom";
import { PriceTag } from "./PriceTag";
import { StarRating } from "./StarRating";
import { FavoriteButton } from "./FavoriteButton";
import { useFavoriteToggle } from "@/hooks/useFavoriteToggle";
import type { PlaceSummary } from "@/types";

export function PlaceCard({ place }: { place: PlaceSummary }) {
  const cover = place.images[0]?.url ?? "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80";
  const { favorited, toggle } = useFavoriteToggle(place.id, place.isFavorited);

  return (
    <div className="flex-none w-[240px] md:w-[266px] bg-surface rounded-lg overflow-hidden shadow-soft border border-border flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={cover} alt={place.name} className="w-full h-full object-cover" />
        <span className="absolute bottom-2.5 left-2.5 bg-ink/70 text-white text-[10.5px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {place.category.name}
        </span>
        <FavoriteButton favorited={favorited} onToggle={toggle} className="absolute top-2.5 right-2.5" />
      </div>

      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
        <h3 className="text-[15px] font-semibold leading-snug">{place.name}</h3>
        <StarRating rating={Number(place.ratingAvg)} reviewCount={place.reviewCount} />
        <p className="text-[11.5px] text-ink-faint flex items-center gap-1">{place.landmark}</p>

        <div className="flex items-center justify-between mt-1.5">
          <PriceTag min={place.priceMin} max={place.priceMax} />
          <Link
            to={`/places/${place.slug}`}
            className="text-xs font-semibold text-primary bg-primary-tint px-3.5 py-2 rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
