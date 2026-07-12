import { Link } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { CategoryCard } from "@/components/CategoryCard";
import { PlaceCard } from "@/components/PlaceCard";
import { Footer } from "@/components/Footer";
import { useCategories, usePlaces } from "@/hooks/useApi";

export function LandingPage() {
  const { data: categories, loading: catsLoading } = useCategories();
  const { data: popular, loading: placesLoading } = usePlaces("?featured=true&limit=4");

  return (
    <div>
      <div className="px-5 py-8 md:px-10 md:py-14 lg:flex lg:items-center lg:gap-14 bg-gradient-to-b from-primary-tint to-bg rounded-b-[32px]">
        <div className="lg:flex-1 lg:max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold tracking-wide text-primary bg-surface px-3 py-1.5 rounded-full mb-4 shadow-soft before:content-['●'] before:text-accent before:text-[9px]">
            FOR UR HUYE CAMPUS STUDENTS
          </span>
          <h1 className="font-display font-semibold text-[34px] lg:text-[48px] leading-tight text-primary-dark mb-3">
            Discover <span className="text-accent">Affordable</span> Places Around Huye University
          </h1>
          <p className="text-[14.5px] lg:text-base text-ink-soft leading-relaxed mb-5 max-w-[34ch] lg:max-w-[42ch]">
            From canteen lunches to late-night printing — find real prices and real contacts before you walk out
            the gate.
          </p>
          <SearchBar placeholder="Search “cheap rice near Simuhuza”" className="lg:max-w-[480px]" />
        </div>
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
          alt="Students eating at a campus canteen"
          className="hidden lg:block lg:flex-1 aspect-[4/3.2] rounded-[28px] object-cover shadow-lift"
        />
      </div>

      <section className="px-5 md:px-10 pt-1.5 pb-2">
        <h2 className="text-[19px] lg:text-[23px] font-semibold mb-3.5">Browse by category</h2>
      </section>
      <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-4.5 overflow-x-auto md:overflow-visible px-5 md:px-10 pb-5">
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
