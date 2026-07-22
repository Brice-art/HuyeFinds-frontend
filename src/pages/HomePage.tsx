import { SearchBar } from "@/components/SearchBar";
import { CategoryCard } from "@/components/CategoryCard";
import { PlaceCard } from "@/components/PlaceCard";
import { useCategories, usePlaces } from "@/hooks/useApi";
import type { PlaceSummary } from "@/types";
import { CategoryCardSkeleton } from "@/components/CategoryCardSkeleton";
import { PlaceCardSkeleton } from "@/components/PlaceCardSkeleton";

interface RailProps {
  title: string;
  seeAllHref: string;
  loading: boolean;
  places?: PlaceSummary[];
}

function Rail({ title, seeAllHref, loading, places }: RailProps) {
  return (
    <>
      <section className="px-5 md:px-10 pt-1.5 pb-2 flex items-baseline justify-between">
        <h2 className="text-[19px] lg:text-[23px] font-semibold">{title}</h2>
        <a href={seeAllHref} className="text-xs font-semibold text-primary">
          See all →
        </a>
      </section>
      <div className="flex gap-4 lg:gap-5 overflow-x-auto px-5 md:px-10 pb-5 lg:pb-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <PlaceCardSkeleton key={i} variant="rail" />
            ))
          : places?.map((p) => (
              <PlaceCard key={p.id} place={p} variant="rail" />
            ))}
      </div>
    </>
  );
}

export function HomePage() {
  const { data: categories, loading: catsLoading } = useCategories();
  const { data: featured, loading: featuredLoading } = usePlaces(
    "?featured=true&limit=6",
  );
  const { data: recent, loading: recentLoading } = usePlaces(
    "?sort=recent&limit=6",
  );
  const { data: favorites, loading: favLoading } = usePlaces(
    "?sort=favorites&limit=4",
  );

  return (
    <div>
      <SearchBar className="mx-5 md:mx-10 lg:max-w-[520px] my-1" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6 sm:grid md:grid-cols-4 md:gap-4.5 overflow-x-auto md:overflow-visible px-5 pb-5">
        {catsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <CategoryCardSkeleton key={i} />
            ))
          : categories?.items.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
      </div>

      <Rail
        title="Featured places"
        seeAllHref="/browse?featured=true"
        loading={featuredLoading}
        places={featured?.items}
      />
      <Rail
        title="Recently added"
        seeAllHref="/browse"
        loading={recentLoading}
        places={recent?.items}
      />
      <Rail
        title="Student favorites"
        seeAllHref="/browse"
        loading={favLoading}
        places={favorites?.items}
      />

      <div className="mx-5 md:mx-10 mb-8 px-4 py-3.5 border border-dashed border-border rounded-md text-xs text-ink-faint flex items-center gap-2.5">
        🏠 Housing listings and student accounts are launching in a future
        update.
      </div>
    </div>
  );
}
