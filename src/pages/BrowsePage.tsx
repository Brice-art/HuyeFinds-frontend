import { useSearchParams } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { PlaceCard } from "@/components/PlaceCard";
import { usePlaces } from "@/hooks/useApi";
import { PlaceCardSkeleton } from "@/components/PlaceCardSkeleton";

const PAGE_SIZE = 8;

export function BrowsePage() {
  const [params, setParams] = useSearchParams();
  const subcategory = params.get("subcategory");
  const search = params.get("search");
  const category = params.get("category");

  const page = Number(params.get("page") ?? "1");
  const normalizedPage = Number.isFinite(page) && page > 0 ? page : 1;

  const safeParams = new URLSearchParams(params.toString());
  if (!safeParams.get("page")) {
    safeParams.set("page", "1");
  }
  if (!safeParams.get("limit")) {
    safeParams.set("limit", String(PAGE_SIZE));
  }

  const { data, loading, error } = usePlaces(`?${safeParams.toString()}`);

  const totalPages = data?.pagination.totalPages ?? 1;

  function updatePage(nextPage: number) {
    const nextParams = new URLSearchParams(params.toString());
    nextParams.set("page", String(Math.min(Math.max(1, nextPage), totalPages || 1)));
    nextParams.set("limit", String(PAGE_SIZE));
    setParams(nextParams, { replace: false });
  }

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-10 xl:px-16">
      <h1 className="mb-4 font-display text-2xl font-semibold">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <PlaceCardSkeleton key={i} />
            ))
          : data?.items.map((p) => <PlaceCard key={p.id} place={p} />)}
      </div>

      {!loading && data?.items.length === 0 && (
        <p className="mt-4 text-sm text-ink-faint">
          No places matched. Try a different search or category.
        </p>
      )}

      {!loading && (data?.items?.length ?? 0) > 0 && totalPages > 1 && (
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => updatePage(normalizedPage - 1)}
            disabled={normalizedPage <= 1}
            className="rounded-full border border-[#e7dbca] bg-[#fffdf9] px-4 py-2 text-[12px] font-semibold text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => updatePage(pageNumber)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-semibold transition-colors ${
                    normalizedPage === pageNumber
                      ? "bg-primary text-white shadow-soft"
                      : "border border-[#e7dbca] bg-[#fffdf9] text-ink hover:border-primary/30"
                  }`}
                >
                  {pageNumber}
                </button>
              ),
            )}
          </div>

          <button
            type="button"
            onClick={() => updatePage(normalizedPage + 1)}
            disabled={normalizedPage >= totalPages}
            className="rounded-full border border-[#e7dbca] bg-[#fffdf9] px-4 py-2 text-[12px] font-semibold text-ink transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
