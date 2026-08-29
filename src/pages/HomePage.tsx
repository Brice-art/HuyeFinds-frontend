import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { CategoryCard } from "@/components/CategoryCard";
import { PlaceCard } from "@/components/PlaceCard";
import { HubPostCard } from "@/components/HubPostCard";
import { useCategories, useHubPosts, usePlaces } from "@/hooks/useApi";
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
    "?featured=true&limit=8",
  );
  const { data: recent, loading: recentLoading } = usePlaces(
    "?sort=recent&limit=8",
  );
  const { data: favorites, loading: favLoading } = usePlaces(
    "?sort=favorites&limit=6",
  );
  const { data: communityPosts, loading: communityLoading } = useHubPosts(
    "?sort=mostLiked&limit=6",
  );

  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const spotlightItems = [
    ...((featured?.items ?? []).slice(0, 6).map((item) => ({ kind: "place" as const, item }))),
    ...((communityPosts?.items ?? []).slice(0, 4).map((item) => ({ kind: "post" as const, item }))),
  ];

  useEffect(() => {
    if (spotlightItems.length <= 3) return;

    const timer = window.setInterval(() => {
      setSpotlightIndex((current) => (current + 1) % Math.max(1, spotlightItems.length - 2));
    }, 4800);

    return () => window.clearInterval(timer);
  }, [spotlightItems.length]);

  const visibleSpotlight = spotlightItems.slice(spotlightIndex, spotlightIndex + 3);
  const spotlightPageCount = Math.max(1, spotlightItems.length - 2);

  return (
    <div>
      <SearchBar className="mx-5 md:mx-10 lg:max-w-[520px] my-1" />

      <section className="px-5 pb-4 pt-2 md:px-10">
        <div className="overflow-hidden rounded-[28px] border border-[#eadcc1] bg-gradient-to-r from-[#f3efe8] via-[#fffaf3] to-[#f3ead8] p-4 shadow-soft md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-dark/70">
                Campus buzz
              </p>
              <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">
                Discover what students are talking about
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                From food spots and study cafés to jobs, events, and deals — the
                community is moving fast across Huye.
              </p>
            </div>

            <a
              href="/students-hub"
              className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-[12px] font-semibold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
            >
              Discover the student community
            </a>
          </div>

          <div className="mt-5">
            <div className="grid gap-4 md:grid-cols-3">
              {communityLoading || featuredLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-[300px] animate-pulse rounded-[18px] bg-white/60" />
                  ))
                : visibleSpotlight.map((entry) => (
                    <div
                      key={entry.kind === "place" ? entry.item.id : entry.item.id}
                      className="transition-all duration-500 ease-out"
                    >
                      {entry.kind === "place" ? (
                        <PlaceCard place={entry.item} variant="rail" />
                      ) : (
                        <HubPostCard post={entry.item} />
                      )}
                    </div>
                  ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2">
              {Array.from({ length: spotlightPageCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSpotlightIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    spotlightIndex === index ? "w-7 bg-primary" : "w-2.5 bg-primary/30 hover:bg-primary/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

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
