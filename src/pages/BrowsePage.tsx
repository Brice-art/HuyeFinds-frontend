import { useSearchParams } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { PlaceCard } from "@/components/PlaceCard";
import { usePlaces } from "@/hooks/useApi";
import { PlaceCardSkeleton } from "@/components/PlaceCardSkeleton";

export function BrowsePage() {
  const [params] = useSearchParams();
  const subcategory = params.get("subcategory");
  const { data, loading, error } = usePlaces(`?${params.toString()}`);

  const search = params.get("search");
  const category = params.get("category");

  return (
    <div className="px-5 md:px-10 py-6">
      <h1 className="font-display text-2xl font-semibold mb-4">
        {search
          ? `Results for "${search}"`
          : subcategory
            ? `Browsing ${subcategory.replace(/-/g, " ")}`
            : category
              ? `Browsing ${category.replace(/-/g, " ")}`
              : "All places"}
      </h1>
      <SearchBar className="mb-6 lg:max-w-[480px]" />

      {error && (
        <p className="text-sm text-heart">Couldn't load places: {error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 lg:gap-5">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <PlaceCardSkeleton key={i} />
            ))
          : data?.items.map((p) => <PlaceCard key={p.id} place={p} />)}
      </div>

      {!loading && data?.items.length === 0 && (
        <p className="text-sm text-ink-faint mt-4">
          No places matched. Try a different search or category.
        </p>
      )}
    </div>
  );
}
