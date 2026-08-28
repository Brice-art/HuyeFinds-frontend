import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdFolder,
  MdLocalOffer,
  MdWork,
  MdPhoneIphone,
  MdCampaign,
  MdEvent,
  MdAutoAwesome,
  MdSearch,
  MdTrendingUp,
  MdArrowForward,
  MdAdd,
} from "react-icons/md";

import { ShareButton } from "@/components/ShareButton";

import { HubPostCard } from "@/components/HubPostCard";
import { PinnedAnnouncements } from "@/components/PinnedAnnouncements";
import { HubPostCardSkeleton } from "@/components/HubPostCardSkeleton";
import { useHubPosts, useHubPostStats } from "@/hooks/useApi";
import { useAuth } from "@/lib/AuthContext";
import { useLocation } from "react-router-dom";
import type { HubPostType } from "@/types";

type SortOption = "newest" | "mostLiked" | "mostViewed";

type HubTab = {
  label: string;
  value: HubPostType | "";
  icon: React.ReactNode;
  description: string;
  color: string;
  tint: string;
};

const TABS: HubTab[] = [
  {
    label: "All Posts",
    value: "",
    icon: <MdFolder size={19} />,
    description: "Everything happening on campus",
    color: "#1F4E3C",
    tint: "#E7F0EA",
  },
  {
    label: "Buy & Sell",
    value: "BUY_SELL",
    icon: <MdLocalOffer size={19} />,
    description: "Items students are selling",
    color: "#B4762A",
    tint: "#FBE4C8",
  },
  {
    label: "Side Hustles",
    value: "SIDE_HUSTLE",
    icon: <MdWork size={19} />,
    description: "Jobs and opportunities",
    color: "#1F4E3C",
    tint: "#E7F0EA",
  },
  {
    label: "Lost & Found",
    value: "LOST_FOUND",
    icon: <MdPhoneIphone size={19} />,
    description: "Help find lost belongings",
    color: "#B4453A",
    tint: "#FDEAEA",
  },
  {
    label: "Announcements",
    value: "ANNOUNCEMENT",
    icon: <MdCampaign size={19} />,
    description: "Important campus updates",
    color: "#2F6FB4",
    tint: "#DCEBFB",
  },
  {
    label: "Events",
    value: "EVENT",
    icon: <MdEvent size={19} />,
    description: "What's happening soon",
    color: "#5B4FA0",
    tint: "#E9E5FB",
  },
];

export function StudentsHubPage() {
  const { user } = useAuth();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<HubPostType | "">("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [search]);

  const { data: stats } = useHubPostStats();

  const query = useMemo(() => {
    const params = new URLSearchParams();

    if (activeTab) {
      params.set("type", activeTab);
    }

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    }

    params.set("sort", sort);

    return `?${params.toString()}`;
  }, [activeTab, debouncedSearch, sort]);

  const { data, loading, error } = useHubPosts(query);

  const activeTabData = TABS.find((tab) => tab.value === activeTab) ?? TABS[0];

  const visibleCount = data?.items?.length ?? 0;

  const location = useLocation();

  return (
    <div className="relative min-w-0">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 bg-cover bg-center"
        style={{
          height: "clamp(260px, 70vh, 700px)",
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0) 35%, rgba(255,255,255,1) 75%), url('/images/ur_building.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />

      {/* Hero */}
      <section className="px-5 pb-8 pt-20 md:px-10 md:pt-28 md:pb-12 min-h-[36vh] md:min-h-[44vh] lg:min-h-[52vh]">
        <div className="mx-auto w-full max-w-7xl px-4 pb-8 pt-20 sm:px-6 md:px-10 md:pt-24">
          <div className="flex flex-col gap-6">
            {/* Heading */}
            <div className="max-w-2xl">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-white/80 px-3 py-1.5 text-[10.5px] font-semibold text-primary shadow-sm backdrop-blur-sm">
                  <MdAutoAwesome size={14} />
                  Student community
                </div>

                <ShareButton
                  variant="pill"
                  title="Students Hub — Huye Finds"
                  description="Find deals, side hustles, events, lost items, and campus announcements shared by students."
                  path="/students-hub"
                />
              </div>

              <h1 className="font-display text-4xl font-bold tracking-tight text-ink md:text-5xl lg:text-[56px] lg:leading-[1.02]">
                What's happening
                <span className="block text-primary">around campus?</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft md:text-[15px]">
                Find deals, side hustles, events, lost items, and important
                announcements shared by students.
              </p>
            </div>

            {/* Search + create */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="group flex min-h-[52px] flex-1 items-center gap-3 rounded-2xl border border-border bg-white px-4 shadow-soft transition-all focus-within:border-primary/30 focus-within:shadow-lift">
                <MdSearch
                  size={21}
                  className="flex-none text-ink-faint transition-colors group-focus-within:text-primary"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search jobs, phones, laptops, events..."
                  className="w-full border-none bg-transparent text-[13.5px] outline-none placeholder:text-ink-faint"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-accent-tint text-xs text-ink-soft transition-colors hover:bg-accent"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              {user && (
                <Link
                  to="/students-hub/new"
                  className="hidden min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-[13px] font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lift sm:inline-flex"
                >
                  <MdAdd size={19} />
                  Create Post
                </Link>
              )}
            </div>

            {/* Popular searches */}
            {!search && (
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="text-ink-faint">Popular:</span>

                {["iPhone", "Jobs", "Events", "Apartments", "Textbooks"].map(
                  (item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSearch(item)}
                      className="rounded-full border border-border bg-white/70 px-2.5 py-1 text-ink-soft transition-all hover:border-primary/20 hover:bg-white hover:text-primary"
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main content */}
      <main className="px-5 pb-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Stats */}
          <section className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-border bg-white/90 p-4 shadow-soft backdrop-blur-sm">
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">
                Total posts
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-primary-dark">
                {stats?.total ?? 0}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white/90 p-4 shadow-soft backdrop-blur-sm">
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">
                Buy & Sell
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-primary-dark">
                {stats?.byType?.BUY_SELL ?? 0}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white/90 p-4 shadow-soft backdrop-blur-sm">
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">
                Opportunities
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-primary-dark">
                {stats?.byType?.SIDE_HUSTLE ?? 0}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white/90 p-4 shadow-soft backdrop-blur-sm">
              <p className="text-[10.5px] font-semibold uppercase tracking-wide text-ink-faint">
                Events
              </p>
              <p className="mt-1 font-display text-2xl font-bold text-primary-dark">
                {stats?.byType?.EVENT ?? 0}
              </p>
            </div>
          </section>

          {/* Categories */}
          <section className="mb-7">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint">
                  Explore
                </p>
                <h2 className="mt-0.5 font-display text-lg font-bold">
                  Browse categories
                </h2>
              </div>
            </div>

            <div className="-mx-5 overflow-x-auto px-5 pb-2 md:-mx-0 md:px-0">
              <div className="flex min-w-max gap-2.5">
                {TABS.map((tab) => {
                  const active = activeTab === tab.value;

                  const count = tab.value
                    ? (stats?.byType?.[tab.value] ?? 0)
                    : (stats?.total ?? 0);

                  return (
                    <button
                      key={tab.label}
                      type="button"
                      onClick={() => setActiveTab(tab.value)}
                      aria-pressed={active}
                      className={`group flex min-w-[145px] items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition-all duration-200 ${
                        active
                          ? "border-primary bg-primary text-white shadow-soft"
                          : "border-border bg-white hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-soft"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 flex-none items-center justify-center rounded-xl transition-colors ${
                          active ? "bg-white/15" : ""
                        }`}
                        style={{
                          backgroundColor: active ? undefined : tab.tint,
                          color: active ? "white" : tab.color,
                        }}
                      >
                        {tab.icon}
                      </span>

                      <span className="min-w-0">
                        <span
                          className={`block text-[12px] font-bold ${
                            active ? "text-white" : "text-ink"
                          }`}
                        >
                          {tab.label}
                        </span>

                        <span
                          className={`mt-0.5 block text-[10px] ${
                            active ? "text-white/70" : "text-ink-faint"
                          }`}
                        >
                          {count} {count === 1 ? "post" : "posts"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Pinned announcements */}
          <section className="mb-8">
            <PinnedAnnouncements />
          </section>

          {/* Feed header */}
          <section className="mb-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-xl font-bold">
                    {debouncedSearch
                      ? `Results for "${debouncedSearch}"`
                      : activeTabData.label}
                  </h2>

                  {!loading && (
                    <span className="rounded-full bg-accent-tint px-2 py-0.5 text-[10px] font-semibold text-primary-dark">
                      {visibleCount}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-[12px] text-ink-faint">
                  {debouncedSearch
                    ? "Posts matching your search"
                    : activeTabData.description}
                </p>
              </div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="w-fit rounded-xl border border-border bg-white px-3.5 py-2.5 text-[12px] font-semibold text-ink outline-none transition-colors focus:border-primary/30"
                aria-label="Sort posts"
              >
                <option value="newest">Newest first</option>
                <option value="mostLiked">Most liked</option>
                <option value="mostViewed">Most viewed</option>
              </select>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-2xl border border-heart/10 bg-heart/5 px-4 py-3">
              <p className="text-[12.5px] font-medium text-heart">
                Couldn't load posts: {error}
              </p>
            </div>
          )}

          {/* Empty state */}
          {!loading && (data?.items?.length ?? 0) === 0 && (
            <div className="mb-8 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-white/70 px-6 py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-tint text-primary">
                <MdSearch size={27} />
              </div>

              <h3 className="font-display text-lg font-bold">
                {debouncedSearch ? "No matching posts" : "Nothing here yet"}
              </h3>

              <p className="mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-ink-faint">
                {debouncedSearch
                  ? `We couldn't find anything matching "${debouncedSearch}". Try another search or category.`
                  : "Be the first student to share something with the community."}
              </p>

              {debouncedSearch ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-5 rounded-full bg-primary px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  Clear search
                </button>
              ) : (
                user && (
                  <Link
                    to="/students-hub/new"
                    className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-primary-dark"
                  >
                    <MdAdd size={16} />
                    Create the first post
                  </Link>
                )
              )}
            </div>
          )}

          {/* Posts */}
          <section>
            <div className="mx-auto w-full max-w-[1200px] px-4">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <HubPostCardSkeleton key={index} />
                  ))
                : data?.items.map((post) => (
                    <HubPostCard key={post.id} post={post} />
                  ))}
              </div>
            </div>
          </section>

          {/* Trending strip */}
          {!loading && (data?.items?.length ?? 0) > 0 && (
            <section className="mt-10 overflow-hidden rounded-3xl bg-primary-dark text-white">
              <div className="flex flex-col gap-5 px-6 py-7 sm:flex-row sm:items-center sm:justify-between md:px-8">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white/10">
                    <MdTrendingUp size={21} />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                      Trending on campus
                    </p>

                    <h3 className="mt-1 font-display text-lg font-bold">
                      See what students are talking about
                    </h3>

                    <p className="mt-1 text-[11.5px] text-white/60">
                      Browse the posts getting the most attention.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSort("mostLiked")}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[11.5px] font-bold text-primary-dark transition-all hover:bg-accent active:scale-95"
                >
                  Most liked
                  <MdArrowForward size={15} />
                </button>
              </div>
            </section>
          )}

          {/* Create CTA */}
          <section className="mt-6 overflow-hidden rounded-3xl bg-primary px-6 py-8 text-white md:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/80">
                  <MdAutoAwesome size={13} />
                  Your campus. Your community.
                </div>

                <h3 className="font-display text-xl font-bold">
                  Have something to share?
                </h3>

                <p className="mt-1 text-[12.5px] text-white/65">
                  Post a job, sell something, share an event, or help someone
                  find a lost item.
                </p>
              </div>

              {user ? (
                <Link
                  to="/students-hub/new"
                  className="inline-flex flex-none items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[12px] font-bold text-primary-dark transition-all hover:-translate-y-0.5 hover:bg-accent active:scale-95"
                >
                  <MdAdd size={17} />
                  Create a post
                </Link>
              ) : (
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="inline-flex flex-none items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[12px] font-bold text-primary-dark transition-all hover:-translate-y-0.5 hover:bg-accent active:scale-95"
                >
                  Sign in to post
                  <MdArrowForward size={15} />
                </Link>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Mobile create button */}
      {user && (
        <Link
          to="/students-hub/new"
          aria-label="Create new post"
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-all hover:scale-105 hover:bg-primary-dark active:scale-90 sm:hidden"
        >
          <MdAdd size={27} />
        </Link>
      )}
    </div>
  );
}
