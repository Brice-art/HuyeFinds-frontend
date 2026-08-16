import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdFolder, MdLocalOffer, MdWork, MdPhoneIphone, MdCampaign, MdEvent, MdAutoAwesome } from "react-icons/md";
import { HubPostCard } from "@/components/HubPostCard";
import { PinnedAnnouncements } from "@/components/PinnedAnnouncements";
import { useHubPosts, useHubPostStats } from "@/hooks/useApi";
import { useAuth } from "@/lib/AuthContext";
import { useLocation } from "react-router-dom";
import type { HubPostType } from "@/types";

type SortOption = "newest" | "mostLiked" | "mostViewed";

const TABS: { label: string; value: HubPostType | ""; icon: JSX.Element }[] = [
  { label: "All Posts", value: "", icon: <MdFolder size={20} /> },
  { label: "Buy & Sell", value: "BUY_SELL", icon: <MdLocalOffer size={20} color="#B4762A" /> },
  { label: "Side Hustles", value: "SIDE_HUSTLE", icon: <MdWork size={20} color="#1F4E3C" /> },
  { label: "Lost & Found", value: "LOST_FOUND", icon: <MdPhoneIphone size={20} color="#B4453A" /> },
  { label: "Announcements", value: "ANNOUNCEMENT", icon: <MdCampaign size={20} color="#2F6FB4" /> },
  { label: "Events", value: "EVENT", icon: <MdEvent size={20} color="#5B4FA0" /> },
];

export function StudentsHubPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<HubPostType | "">("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search.trim()), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const { data: stats } = useHubPostStats();

  const params = new URLSearchParams();
  if (activeTab) params.set("type", activeTab);
  if (debouncedSearch) params.set("search", debouncedSearch);
  params.set("sort", sort);

  const { data, loading, error } = useHubPosts(`?${params.toString()}`);

  const location = useLocation();

  return (
    <div className="relative">
      <div
        aria-hidden
        className="fixed left-0 right-0 top-0 -z-10 bg-cover bg-center pointer-events-none"
        style={{
          height: "clamp(280px, 100vh, 800px)",
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0) 45%, rgba(255,255,255,1) 75%), url('/images/ur_building.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />
      <div className="px-5 md:px-10 py-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-semibold flex items-center gap-2">
          Students Hub
          <MdAutoAwesome className="text-primary" size={18} />
        </h1>
        {user && (
          <Link
            to="/students-hub/new"
            className="bg-primary text-white text-[13px] font-semibold px-4 py-2 rounded-full flex-none"
          >
            + New Post
          </Link>
        )}
      </div>
      <p className="text-sm text-ink-soft mb-5">
        Side hustles, buy &amp; sell, lost &amp; found, campus events, and
        announcements — posted directly by students.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="flex-1 flex items-center gap-2.5 bg-surface border border-border rounded-full shadow-soft px-4 py-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="text-ink-faint flex-none"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs, phones, laptops, events…"
            className="w-full border-none outline-none bg-transparent text-[13.5px]"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="border border-border rounded-lg px-4 py-3 text-[13px] font-semibold bg-surface"
        >
          <option value="newest">Sort: Newest</option>
          <option value="mostLiked">Sort: Most liked</option>
          <option value="mostViewed">Sort: Most viewed</option>
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-1">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-none flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-full border ${
              activeTab === tab.value
                ? "bg-primary text-white border-primary"
                : "bg-surface text-ink-soft border-border"
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
            <span
              className={
                activeTab === tab.value ? "text-white/80" : "text-ink-faint"
              }
            >
              {tab.value
                ? (stats?.byType[tab.value] ?? 0)
                : (stats?.total ?? 0)}
            </span>
          </button>
        ))}
      </div>

      <PinnedAnnouncements />

      {error && (
        <p className="text-sm text-heart">Couldn't load posts: {error}</p>
      )}
      {loading && <p className="text-sm text-ink-faint">Loading…</p>}

      {!loading && data?.items.length === 0 && (
        <p className="text-sm text-ink-faint mt-4">
          Nothing here yet.{" "}
          {user ? (
            <Link to="/students-hub/new" className="text-primary font-semibold">
              Be the first to post.
            </Link>
          ) : (
            <>
              <Link to="/login" state={{ from: location}} className="text-primary font-semibold">
                Sign in
              </Link>{" "}
              to post.
            </>
          )}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {data?.items.map((post) => (
          <HubPostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="bg-primary-dark text-white rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-semibold text-lg mb-1">
            Have something to share with students?
          </h3>
          <p className="text-[13px] text-[#B7C9BF]">
            Post a job, lost item, event, or announcement.
          </p>
        </div>
        {user ? (
          <Link
            to="/students-hub/new"
            className="bg-white text-primary-dark font-semibold text-[13px] px-5 py-2.5 rounded-full flex-none"
          >
            + Create New Post
          </Link>
        ) : (
          <Link
            to="/login"
            state={{ from: location }}
            className="bg-white text-primary-dark font-semibold text-[13px] px-5 py-2.5 rounded-full flex-none"
          >
            Sign in to post
          </Link>
        )}
      </div>
      </div>
    </div>
  );
}
