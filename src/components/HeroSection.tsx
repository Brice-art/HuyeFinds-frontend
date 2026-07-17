import { Link } from "react-router-dom";
import { PhoneMockup } from "./PhoneMockup";
import { useScrollZoom } from "@/hooks/useScrollZoom";

const CATS = [
  {
    name: "Restaurants",
    count: 26,
    tint: "#FBE4C8",
    fg: "#B4762A",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 10.5c0-3 3.6-5.5 8-5.5s8 2.5 8 5.5" />
        <line x1="3.5" y1="10.5" x2="20.5" y2="10.5" />
        <line x1="3.5" y1="13.5" x2="20.5" y2="13.5" />
        <path d="M4 16.5h16c0 1.7-1.8 3-4 3H8c-2.2 0-4-1.3-4-3z" />
      </svg>
    ),
  },
  {
    name: "Grocery Stores",
    count: 18,
    tint: "#E7F0EA",
    fg: "#1F4E3C",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path d="M5 9h14l-1.5 10a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 9z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </svg>
    ),
  },
  {
    name: "Pharmacies",
    count: 12,
    tint: "#DCEBFB",
    fg: "#2F6FB4",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
        <rect x="4" y="7" width="16" height="13" rx="2.5" />
        <line x1="12" y1="11" x2="12" y2="16" />
        <line x1="9.5" y1="13.5" x2="14.5" y2="13.5" />
      </svg>
    ),
  },
  {
    name: "Printing Shops",
    count: 8,
    tint: "#E9E5FB",
    fg: "#5B4FA0",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path d="M6 9V3h12v6" />
        <rect x="4" y="9" width="16" height="8" rx="2" />
        <path d="M6 17v4h12v-4" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    label: "Easy to find",
    desc: "Browse places by category",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    label: "See details",
    desc: "Photos, prices, contacts & more",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M20.6 3.4a2 2 0 0 0-2.8 0L4 17.2V20h2.8L20.6 6.2a2 2 0 0 0 0-2.8z" />
      </svg>
    ),
  },
  {
    label: "Save & Rate",
    desc: "Save favorites and share your review",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
      </svg>
    ),
  },
  {
    label: "For Students",
    desc: "Built for UR Huye students",
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="9" cy="8" r="3.2" />
        <path d="M2.5 20c0-3.3 3-5.5 6.5-5.5s6.5 2.2 6.5 5.5" />
        <circle cx="17.5" cy="8.5" r="2.4" />
        <path d="M15.5 14.8c2.6.4 4.5 2.2 4.5 5.2" />
      </svg>
    ),
  },
];

const POPULAR = [
  {
    name: "Inzora Restaurant",
    meta: "Rwandan · $$",
    rating: "4.5",
    reviews: 32,
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80",
  },
  {
    name: "Petro Huye Supermarket",
    meta: "Grocery · $$",
    rating: "4.2",
    reviews: 18,
    img: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&q=80",
  },
];

export function HeroSection() {
  const tiltRef = useScrollZoom<HTMLDivElement>();

  return (
    <>
      <div className="relative overflow-hidden rounded-b-[40px]">
        {/* Background photo + fade */}
        <img
          src="https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1600&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/55 to-bg" />

        {/* Decorative brush-stroke blobs */}
        <div
          className="absolute -left-16 bottom-10 w-56 h-24 bg-accent/40 blur-3xl rounded-full rotate-[-12deg]"
          aria-hidden="true"
        />
        <div
          className="absolute -right-10 top-1/3 w-64 h-40 bg-primary/25 blur-3xl rounded-full rotate-[10deg]"
          aria-hidden="true"
        />

        <div className="relative px-5 py-10 md:px-10 md:py-14 lg:flex lg:items-center lg:gap-16 lg:py-20">
          <div className="lg:flex-1 lg:max-w-lg">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-primary mb-1"
              aria-hidden="true"
            >
              <path d="M12 2c1 4 3 7 7 8-4 1-6 4-7 8-1-4-3-7-7-8 4-1 6-4 7-8z" />
            </svg>
            <h1 className="font-display font-bold text-[38px] leading-[1.08] lg:text-[52px] text-ink mb-4">
              Find everything
              <br />
              you need in
              <br />
              <span className="text-primary">Huye.</span>
            </h1>
            <p className="text-[15px] lg:text-base text-ink-soft leading-relaxed mb-6 max-w-[38ch]">
              Discover the best places around UR Huye. Restaurants,
              shops, services and more, all in one place.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-9">
              <Link
                to="/home"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-6 py-3.5 rounded-full shadow-lift"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="12" cy="12" r="9" />
                  <polygon points="16 8 13.5 13.5 8 16 10.5 10.5 16 8" />
                </svg>
                Explore Places
              </Link>
              <Link
                to="/favorites"
                className="inline-flex items-center gap-2 bg-white text-ink font-semibold text-sm px-6 py-3.5 rounded-full border border-border shadow-soft"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
                </svg>
                Save Favorites
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-6">
              {FEATURES.map((f) => (
                <div key={f.label}>
                  <div className="w-9 h-9 rounded-full bg-primary-tint text-primary flex items-center justify-center mb-2.5">
                    {f.icon}
                  </div>
                  <div className="text-[13.5px] font-semibold text-ink">
                    {f.label}
                  </div>
                  <div className="text-[11.5px] text-ink-soft leading-snug mt-0.5">
                    {f.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone mockup — static/illustrative, not live app data */}
          <div className="hidden lg:block lg:flex-1">
            <div
              ref={tiltRef}
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform",
                transformOrigin: "center center",
              }}
            >
              <PhoneMockup>
                <div className="text-ink">
                  <p className="text-[13px] text-ink-soft">Hello, Customer 👋</p>
                  <h2 className="font-display font-bold text-[17px] leading-snug mb-3">
                    What are you looking for today?
                  </h2>

                  <div className="flex items-center gap-2 bg-surface border border-border rounded-full px-3.5 py-2.5 mb-4 shadow-soft">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="text-ink-faint"
                    >
                      <circle cx="11" cy="11" r="7" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span className="text-[12px] text-ink-faint">
                      Search for places…
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[12.5px] font-semibold">
                      Categories
                    </span>
                    <span className="text-[10.5px] text-primary font-semibold">
                      View all
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {CATS.map((c) => (
                      <div
                        key={c.name}
                        className="bg-surface border border-border rounded-xl p-2.5"
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center mb-1.5"
                          style={{ background: c.tint, color: c.fg }}
                        >
                          {c.icon}
                        </div>
                        <div className="text-[11px] font-semibold leading-tight">
                          {c.name}
                        </div>
                        <div className="text-[9.5px] text-ink-faint">
                          {c.count} places
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[12.5px] font-semibold">
                      Popular Near You
                    </span>
                    <span className="text-[10.5px] text-primary font-semibold">
                      View all
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {POPULAR.map((p) => (
                      <div
                        key={p.name}
                        className="flex items-center gap-2.5 bg-surface border border-border rounded-xl p-2"
                      >
                        <img
                          src={p.img}
                          alt=""
                          className="w-11 h-11 rounded-lg object-cover flex-none"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11.5px] font-semibold truncate">
                            {p.name}
                          </div>
                          <div className="text-[9.5px] text-accent font-semibold">
                            ★ {p.rating} ({p.reviews})
                          </div>
                          <div className="text-[10px] text-ink-faint">
                            {p.meta}
                          </div>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-primary-tint text-primary flex items-center justify-center flex-none">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.2}
                          >
                            <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .7a2 2 0 0 1 1.7 2z" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom nav, pinned within the phone frame */}
                <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between bg-surface border border-border rounded-2xl px-3 py-2.5 shadow-soft">
                  <div className="flex flex-col items-center gap-1 text-primary">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M3 12l9-9 9 9" />
                      <path d="M5 10v10h14V10" />
                    </svg>
                    <span className="text-[8px] font-semibold">Home</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-ink-faint">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
                    </svg>
                    <span className="text-[8px] font-semibold">Favorites</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 -mt-4">
                    <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-lift">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.4}
                      >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                    <span className="text-[8px] font-semibold text-ink-faint">
                      Add
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-ink-faint">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                    <span className="text-[8px] font-semibold">Categories</span>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-ink-faint">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                    </svg>
                    <span className="text-[8px] font-semibold">Profile</span>
                  </div>
                </div>
              </PhoneMockup>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom banner */}
      <div className="mx-5 md:mx-10 -mt-4 md:-mt-6 relative z-10 flex items-center justify-between gap-4 bg-surface border border-border rounded-2xl shadow-soft px-5 py-4 md:px-7 md:py-5">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-full bg-primary-tint text-primary flex items-center justify-center flex-none">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M22 10 12 5 2 10l10 5 10-5z" />
              <path d="M6 12v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
            </svg>
          </div>
          <div>
            <div className="text-[14.5px] font-semibold text-primary">
              New in Huye? We've got you.
            </div>
            <div className="text-[12.5px] text-ink-soft">
              Explore trusted places and make your student life easier.
            </div>
          </div>
        </div>
        <svg
          className="hidden sm:block flex-none text-primary/30"
          width="90"
          height="52"
          viewBox="0 0 90 52"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
        >
          <circle cx="10" cy="38" r="7" />
          <line x1="10" y1="45" x2="10" y2="50" />
          <rect x="20" y="18" width="20" height="30" rx="1" />
          <path d="M25 18v-6a5 5 0 0 1 10 0v6" />
          <rect x="26" y="38" width="8" height="10" />
          <rect x="44" y="6" width="16" height="42" rx="1" />
          <line x1="48" y1="14" x2="48" y2="14.2" />
          <line x1="56" y1="14" x2="56" y2="14.2" />
          <line x1="48" y1="22" x2="48" y2="22.2" />
          <line x1="56" y1="22" x2="56" y2="22.2" />
          <rect x="64" y="24" width="18" height="24" rx="1" />
          <circle cx="80" cy="40" r="7" />
          <line x1="80" y1="47" x2="80" y2="50" />
        </svg>
      </div>
    </>
  );
}
