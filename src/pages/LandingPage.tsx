import { Link } from "react-router-dom";
import { HeroSection } from "@/components/HeroSection";
import { CategoryCard } from "@/components/CategoryCard";
import { PlaceCard } from "@/components/PlaceCard";
import { Footer } from "@/components/Footer";
import { useCategories, usePlaces } from "@/hooks/useApi";

export function LandingPage() {
  const { data: categories, loading: catsLoading } = useCategories();
  const { data: popular, loading: placesLoading } = usePlaces("?featured=true&limit=4");

  return (
    <div>
      <HeroSection />

      <section className="px-5 md:px-10 pt-1.5 pb-2">
        <h2 className="text-[19px] lg:text-[23px] font-semibold mb-3.5">Browse by category</h2>
      </section>
      <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4.5 overflow-x-auto md:overflow-visible px-5 md:px-10 pb-5">
        {catsLoading && <p className="text-sm text-ink-faint">Loading categories…</p>}
        {categories?.items.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>

      <section className="px-5 md:px-10 pt-1.5 pb-2 flex items-baseline justify-between">
        <h2 className="text-[19px] lg:text-[23px] font-semibold">Popular places</h2>
        <Link to="/home" className="text-xs font-semibold text-primary">See all →</Link>
      </section>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 lg:gap-5 px-5 md:px-10 pb-6">
        {placesLoading && <p className="text-sm text-ink-faint col-span-full">Loading places…</p>}
        {popular?.items.map((p) => (
          <PlaceCard key={p.id} place={p} />
        ))}
        {!placesLoading && popular?.items.length === 0 && (
          <p className="text-sm text-ink-faint col-span-full">
            No places yet — run the seed script to add sample data.
          </p>
        )}
      </div>

      <Footer />
    </div>
  );
}
