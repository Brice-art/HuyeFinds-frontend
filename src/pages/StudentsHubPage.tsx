import { useState } from "react";
import { Link } from "react-router-dom";
import { HubPostCard } from "@/components/HubPostCard";
import { HubPostCardSkeleton } from "@/components/HubPostCardSkeleton";
import { useHubPosts } from "@/hooks/useApi";
import { useAuth } from "@/lib/AuthContext";
import type { HubPostType } from "@/types";

const TABS: { label: string; value: HubPostType | "" }[] = [
  { label: "All", value: "" },
  { label: "Side Hustles", value: "SIDE_HUSTLE" },
  { label: "Lost & Found", value: "LOST_FOUND" },
  { label: "Events", value: "EVENT" },
  { label: "Announcements", value: "ANNOUNCEMENT" },
];

export function StudentsHubPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<HubPostType | "">("");
  const [refreshKey, setRefreshKey] = useState(0);

  const query = activeTab ? `?type=${activeTab}` : "";
  const { data, loading, error } = useHubPosts(query, refreshKey);

  return (
    <div className="px-5 md:px-10 py-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl font-semibold">Students Hub</h1>
        {user && (
          <Link
            to="/students-hub/new"
            className="bg-primary text-white text-[13px] font-semibold px-4 py-2 rounded-full flex-none"
          >
            + New post
          </Link>
        )}
      </div>
      <p className="text-sm text-ink-soft mb-5">
        Side hustles, lost & found, campus events, and announcements — posted
        directly by students.
      </p>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-1">
        {TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.value)}
            className={`flex-none text-[13px] font-semibold px-4 py-2 rounded-full border ${
              activeTab === tab.value
                ? "bg-primary text-white border-primary"
                : "bg-surface text-ink-soft border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-heart">Couldn't load posts: {error}</p>
      )}

      {!loading && data?.items.length === 0 && (
        <p className="text-sm text-ink-faint mt-4">
          Nothing here yet.{" "}
          {user ? (
            <Link to="/students-hub/new" className="text-primary font-semibold">
              Be the first to post.
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-primary font-semibold">
                Sign in
              </Link>{" "}
              to post.
            </>
          )}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <HubPostCardSkeleton key={i} />
            ))
          : data?.items.map((post) => (
              <HubPostCard
                key={post.id}
                post={post}
                onDeleted={() => setRefreshKey((k) => k + 1)}
              />
            ))}
      </div>
    </div>
  );
}
