import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdArrowForward,
  MdCheckCircle,
  MdDashboard,
  MdDeleteOutline,
  MdFilterList,
  MdGroups,
  MdNotifications,
  MdStorefront,
  MdTrendingUp,
} from "react-icons/md";

import { api } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import type { AdminOverview, HubPost } from "@/types";

const typeLabels: Record<string, string> = {
  BUY_SELL: "Buy & Sell",
  SIDE_HUSTLE: "Side Hustle",
  LOST_FOUND: "Lost & Found",
  EVENT: "Event",
  ANNOUNCEMENT: "Announcement",
};

type NavigationTab = "Overview" | "Moderation" | "Places" | "Users";
type PostFilter = "all" | "pending" | "approved";

const typeOptions = [
  "ALL",
  "BUY_SELL",
  "SIDE_HUSTLE",
  "LOST_FOUND",
  "EVENT",
  "ANNOUNCEMENT",
];

export function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyIds, setBusyIds] = useState<Record<string, boolean>>({});

  const [postFilter, setPostFilter] = useState<PostFilter>("pending");

  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const [activeNav, setActiveNav] = useState<NavigationTab>("Overview");

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      navigate("/login", {
        replace: true,
        state: { from: "/admin" },
      });

      return;
    }

    if (user.role !== "ADMIN") {
      navigate("/home", {
        replace: true,
      });
    }
  }, [authLoading, user, navigate]);

  const loadOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.get<AdminOverview>("/admin/overview");

      setOverview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role !== "ADMIN") {
      return;
    }

    loadOverview();
  }, [user, loadOverview]);

  async function handleApprove(id: string) {
    try {
      setBusyIds((previous) => ({
        ...previous,
        [id]: true,
      }));

      setError(null);

      await api.patch(`/admin/hub-posts/${id}/approve`, {});

      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to approve post");
    } finally {
      setBusyIds((previous) => ({
        ...previous,
        [id]: false,
      }));
    }
  }

  async function handleReject(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to reject and delete this post?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setBusyIds((previous) => ({
        ...previous,
        [id]: true,
      }));

      setError(null);

      await api.delete(`/admin/hub-posts/${id}/reject`);

      await loadOverview();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reject post");
    } finally {
      setBusyIds((previous) => ({
        ...previous,
        [id]: false,
      }));
    }
  }

  const pendingPosts = useMemo(
    () => overview?.pendingHubPosts ?? [],
    [overview],
  );

  const visiblePosts = useMemo(() => {
    if (postFilter === "approved") {
      return [];
    }

    if (typeFilter === "ALL") {
      return pendingPosts;
    }

    return pendingPosts.filter((post) => post.type === typeFilter);
  }, [pendingPosts, postFilter, typeFilter]);

  const totalUsers = overview?.stats.totalUsers ?? 0;

  const totalPlaces = overview?.stats.totalPlaces ?? 0;

  const totalHubPosts = overview?.stats.totalHubPosts ?? 0;

  const activeHubPosts = overview?.stats.activeHubPosts ?? 0;

  const pendingHubPosts = overview?.stats.pendingHubPosts ?? 0;

  const userWeeklyGrowthPercent = overview?.stats.userWeeklyGrowthPercent ?? 0;

  const usersCreatedLast7Days = overview?.stats.usersCreatedLast7Days ?? 0;

  const usersCreatedLast30Days = overview?.stats.usersCreatedLast30Days ?? 0;

  const recentUsers = overview?.recentUsers ?? [];

  const placeInsights = overview?.placeInsights ?? {
    topCategories: [],
    topPlaces: [],
  };

  const hubPostInsights = overview?.hubPostInsights ?? {
    mostLiked: [],
    mostViewed: [],
  };

  const approvalRate =
    totalHubPosts > 0 ? Math.round((activeHubPosts / totalHubPosts) * 100) : 0;

  const userGrowthBadge =
    userWeeklyGrowthPercent === null
      ? {
          label: "New",
          text: "New",
          tone: "bg-[#f3f4f6] text-[#475467]",
          arrow: "•",
          color: "text-[#475467]",
        }
      : userWeeklyGrowthPercent > 0
        ? {
            label: "Increase",
            text: `+${userWeeklyGrowthPercent}%`,
            tone: "bg-[#eaf3ee] text-[#1d7c54]",
            arrow: "↑",
            color: "text-[#1d7c54]",
          }
        : userWeeklyGrowthPercent < 0
          ? {
              label: "Decrease",
              text: `-${Math.abs(userWeeklyGrowthPercent)}%`,
              tone: "bg-[#fef2f2] text-[#b42318]",
              arrow: "↓",
              color: "text-[#b42318]",
            }
          : {
              label: "No change",
              text: "0%",
              tone: "bg-[#f3f4f6] text-[#475467]",
              arrow: "→",
              color: "text-[#475467]",
            };

  const stats = [
    {
      label: "Total users",
      value: totalUsers,
      icon: <MdGroups size={18} />,
      tint: "bg-[#e6f6ec] text-[#1d5c3d]",
    },
    {
      label: "User growth",
      value: userGrowthBadge.text,
      icon: <MdTrendingUp size={18} />,
      tint:
        userWeeklyGrowthPercent >= 0
          ? "bg-[#eaf9ee] text-[#1e7d4e]"
          : "bg-[#fff1f2] text-[#b42318]",
      badge:
        userWeeklyGrowthPercent >= 0 ? "↑" : userWeeklyGrowthPercent < 0 ? "↓" : "→",
    },
    {
      label: "Active places",
      value: totalPlaces,
      icon: <MdStorefront size={18} />,
      tint: "bg-[#eef3ff] text-[#2d5aa7]",
    },
    {
      label: "Hub posts",
      value: totalHubPosts,
      icon: <MdDashboard size={18} />,
      tint: "bg-[#f1ebff] text-[#5143a9]",
    },
    {
      label: "Pending",
      value: pendingHubPosts,
      icon: <MdNotifications size={18} />,
      tint: "bg-[#fff1d9] text-[#af6b00]",
    },
  ];

  const workspaceTabs = [
    {
      label: "Overview" as NavigationTab,
      count: totalHubPosts,
    },
    {
      label: "Moderation" as NavigationTab,
      count: pendingHubPosts,
    },
    {
      label: "Places" as NavigationTab,
      count: totalPlaces,
    },
    {
      label: "Users" as NavigationTab,
      count: totalUsers,
    },
  ];

  const overviewSection = (
    <>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#e9dfd2] bg-white/80 p-4 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${stat.tint}`}
              >
                {stat.icon}
              </span>

              {stat.badge ? (
                <span
                  className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-[11px] font-bold ${
                    stat.label === "User growth"
                      ? userWeeklyGrowthPercent >= 0
                        ? "bg-[#eaf3ee] text-[#1d7c54]"
                        : "bg-[#fef2f2] text-[#b42318]"
                      : "bg-[#f3f4f6] text-[#475467]"
                  }`}
                >
                  {stat.badge}
                </span>
              ) : null}
            </div>

            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              {stat.label}
            </p>

            <p className="mt-2 font-display text-[1.8rem] font-bold leading-tight text-primary-dark">
              {loading ? "..." : stat.value}
            </p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-[#e9dfd2] bg-white p-5 shadow-soft">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
                Content health
              </p>

              <h2 className="mt-1 font-display text-xl font-bold text-primary-dark">
                Platform overview
              </h2>
            </div>

            <span className="rounded-full bg-[#eaf3ee] px-3 py-1 text-[11px] font-semibold text-primary-dark">
              {approvalRate}% approved
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-[#f7f4ef] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                Approved
              </p>

              <p className="mt-2 font-display text-2xl font-bold text-primary-dark">
                {activeHubPosts}
              </p>
            </div>

            <div className="rounded-2xl bg-[#fff8eb] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                Pending
              </p>

              <p className="mt-2 font-display text-2xl font-bold text-primary-dark">
                {pendingHubPosts}
              </p>
            </div>

            <div className="rounded-2xl bg-[#edf7f0] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
                Approval rate
              </p>

              <p className="mt-2 font-display text-2xl font-bold text-primary-dark">
                {approvalRate}%
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-[#e9dfd2] bg-[#faf7f3] p-4 shadow-soft">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              Total users
            </p>

            <p className="mt-2 font-display text-2xl font-bold text-primary-dark">
              {totalUsers}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9dfd2] bg-[#faf7f3] p-4 shadow-soft">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              New users, 7 days
            </p>

            <p className="mt-2 font-display text-2xl font-bold text-primary-dark">
              {usersCreatedLast7Days}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9dfd2] bg-[#faf7f3] p-4 shadow-soft">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              New users, 30 days
            </p>

            <p className="mt-2 font-display text-2xl font-bold text-primary-dark">
              {usersCreatedLast30Days}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9dfd2] bg-[#faf7f3] p-4 shadow-soft">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
              User growth, 7 days
            </p>

            <div className="mt-2 flex items-center justify-between gap-2">
              <p className={`font-display text-2xl font-bold ${userGrowthBadge.color}`}>
                {userGrowthBadge.text}
              </p>

              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold ${userGrowthBadge.tone}`}
              >
                {userGrowthBadge.arrow}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-[#e9dfd2] bg-white p-5 shadow-soft">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-primary-dark">
              Recent signups
            </h3>
            <span className="rounded-full bg-[#eef5ff] px-2.5 py-1 text-[10px] font-semibold text-primary-dark">
              Last 7 users
            </span>
          </div>

          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-[12.5px] text-ink-faint">No recent users yet.</p>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[#f0e7dc] bg-[#faf7f3] px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold text-primary-dark">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-ink-faint">{user.email}</p>
                  </div>

                  <span className="text-[10px] font-medium text-ink-faint">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-[#e9dfd2] bg-white p-5 shadow-soft">
          <div className="mb-4">
            <h3 className="font-display text-xl font-bold text-primary-dark">
              Place insights
            </h3>
          </div>

          <div className="space-y-3">
            {placeInsights.topCategories.length === 0 ? (
              <p className="text-[12.5px] text-ink-faint">No category data yet.</p>
            ) : (
              placeInsights.topCategories.map((category) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between rounded-2xl border border-[#f0e7dc] bg-[#faf7f3] px-3 py-2"
                >
                  <span className="text-[12px] font-medium text-primary-dark">
                    {category.name}
                  </span>
                  <span className="rounded-full bg-[#eaf3ee] px-2 py-1 text-[10px] font-semibold text-primary-dark">
                    {category.count} places
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-3xl border border-[#e9dfd2] bg-white p-5 shadow-soft">
          <h3 className="font-display text-xl font-bold text-primary-dark">
            Most liked hub posts
          </h3>

          <div className="mt-4 space-y-3">
            {hubPostInsights.mostLiked.length === 0 ? (
              <p className="text-[12.5px] text-ink-faint">No liked posts yet.</p>
            ) : (
              hubPostInsights.mostLiked.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-[#f0e7dc] bg-[#faf7f3] px-3 py-2"
                >
                  <p className="text-[12px] font-semibold text-primary-dark">{post.title}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-ink-faint">
                    <span>{post.authorName}</span>
                    <span>{post.likes} likes</span>
                    <span>{post.viewCount} views</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-[#e9dfd2] bg-white p-5 shadow-soft">
          <h3 className="font-display text-xl font-bold text-primary-dark">
            Most viewed hub posts
          </h3>

          <div className="mt-4 space-y-3">
            {hubPostInsights.mostViewed.length === 0 ? (
              <p className="text-[12.5px] text-ink-faint">No views recorded yet.</p>
            ) : (
              hubPostInsights.mostViewed.map((post) => (
                <div
                  key={post.id}
                  className="rounded-2xl border border-[#f0e7dc] bg-[#faf7f3] px-3 py-2"
                >
                  <p className="text-[12px] font-semibold text-primary-dark">{post.title}</p>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-ink-faint">
                    <span>{post.authorName}</span>
                    <span>{post.viewCount} views</span>
                    <span>{post.likes} likes</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );

  const moderationSection = (
    <section className="rounded-3xl border border-[#e9dfd2] bg-white p-4 shadow-soft md:p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-primary-dark">
            Moderation queue
          </h2>

          <p className="text-[12.5px] text-ink-faint">
            Review incoming community posts.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#e9dfd2] bg-[#faf7f3] p-1">
          {[
            {
              id: "pending" as PostFilter,
              label: "Pending",
            },
            {
              id: "all" as PostFilter,
              label: "All",
            },
            {
              id: "approved" as PostFilter,
              label: "Approved",
            },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setPostFilter(item.id)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                postFilter === item.id
                  ? "bg-primary text-white"
                  : "text-ink-soft hover:text-primary-dark"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
        <span className="inline-flex items-center gap-1 rounded-full border border-[#e9dfd2] bg-[#faf7f3] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-faint">
          <MdFilterList size={12} />
          Filter
        </span>

        {typeOptions.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setTypeFilter(type)}
            className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-semibold transition-colors ${
              typeFilter === type
                ? "bg-[#eaf3ee] text-primary-dark"
                : "bg-[#faf7f3] text-ink-soft hover:text-primary-dark"
            }`}
          >
            {type === "ALL" ? "All types" : (typeLabels[type] ?? type)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-dashed border-[#e2d9cc] bg-[#faf7f3] px-4 py-10 text-center text-[12.5px] text-ink-faint">
          Loading moderation queue...
        </div>
      ) : postFilter === "approved" ? (
        <div className="rounded-2xl border border-dashed border-[#e2d9cc] bg-[#faf7f3] px-4 py-10 text-center text-[12.5px] text-ink-faint">
          Approved posts are not included in this endpoint.
        </div>
      ) : visiblePosts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#e2d9cc] bg-[#faf7f3] px-4 py-10 text-center text-[12.5px] text-ink-faint">
          No pending posts found.
        </div>
      ) : (
        <div className="space-y-3">
          {visiblePosts.map((post: HubPost) => (
            <article
              key={post.id}
              className="rounded-2xl border border-[#ece1d2] bg-[#fcfaf7] p-4"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#eaf1ee] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary-dark">
                      {typeLabels[post.type] ?? post.type}
                    </span>

                    {post.isUrgent && (
                      <span className="rounded-full bg-[#ffe8e4] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9d403b]">
                        Urgent
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-lg font-bold text-primary-dark">
                    {post.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-ink-soft">
                    {post.description}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2 md:flex-col">
                  <button
                    type="button"
                    disabled={busyIds[post.id]}
                    onClick={() => handleApprove(post.id)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-[11px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <MdCheckCircle size={14} />

                    {busyIds[post.id] ? "Processing..." : "Approve"}
                  </button>

                  <button
                    type="button"
                    disabled={busyIds[post.id]}
                    onClick={() => handleReject(post.id)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#e6d7c2] bg-white px-3.5 py-2 text-[11px] font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <MdDeleteOutline size={14} />
                    Reject
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-2 text-[11px] text-ink-faint sm:grid-cols-4">
                <span>By {post.author?.name ?? "Unknown"}</span>

                <span>{new Date(post.createdAt).toLocaleDateString()}</span>

                <span>{post.likeCount ?? 0} likes</span>

                <span>{post.commentCount ?? 0} comments</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );

  const placesSection = (
    <section className="rounded-3xl border border-[#e9dfd2] bg-white p-5 shadow-soft">
      <h2 className="font-display text-xl font-bold text-primary-dark">
        Places overview
      </h2>

      <p className="mt-1 text-[12.5px] text-ink-faint">
        Current place statistics.
      </p>

      <div className="mt-4">
        <div className="rounded-2xl bg-[#f7f4ef] p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
            Active places
          </p>

          <p className="mt-2 font-display text-3xl font-bold text-primary-dark">
            {totalPlaces}
          </p>
        </div>
      </div>
    </section>
  );

  const usersSection = (
    <section className="rounded-3xl border border-[#e9dfd2] bg-white p-5 shadow-soft">
      <h2 className="font-display text-xl font-bold text-primary-dark">
        User insights
      </h2>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-[#edf7f0] p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            Total users
          </p>

          <p className="mt-2 font-display text-2xl font-bold text-primary-dark">
            {totalUsers}
          </p>
        </div>

        <div className="rounded-2xl bg-[#edf7f0] p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            Growth, 7 days
          </p>

          <p
            className={`mt-2 font-display text-2xl font-bold ${userWeeklyGrowthPercent >= 0 ? "text-[#1d7c54]" : "text-[#b42318]"}`}
          >
            {userWeeklyGrowthPercent === null
              ? "New"
              : userWeeklyGrowthPercent > 0
                ? `+${userWeeklyGrowthPercent}%`
                : userWeeklyGrowthPercent < 0
                  ? `-${Math.abs(userWeeklyGrowthPercent)}%`
                  : "0%"}
          </p>
        </div>

        <div className="rounded-2xl bg-[#edf7f0] p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            New users, 7 days
          </p>

          <p className="mt-2 font-display text-2xl font-bold text-primary-dark">
            {usersCreatedLast7Days}
          </p>
        </div>

        <div className="rounded-2xl bg-[#edf7f0] p-4">
          <p className="text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            New users, 30 days
          </p>

          <p className="mt-2 font-display text-2xl font-bold text-primary-dark">
            {usersCreatedLast30Days}
          </p>
        </div>
      </div>
    </section>
  );

  const sections: Record<NavigationTab, React.ReactNode> = {
    Overview: overviewSection,
    Moderation: moderationSection,
    Places: placesSection,
    Users: usersSection,
  };

  const pageTitles: Record<NavigationTab, string> = {
    Overview: "Campus overview",
    Moderation: "Moderation center",
    Places: "Places dashboard",
    Users: "User insights",
  };

  return (
    <div className="min-h-screen bg-[#f5f1ea] px-4 py-6 text-ink md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="rounded-3xl border border-[#e9dfd2] bg-[#f8f4ee] p-4 shadow-soft xl:sticky xl:top-6 xl:h-fit">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-white">
                <MdDashboard size={18} />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                  Workspace
                </p>

                <h2 className="font-display text-lg font-bold text-primary-dark">
                  Admin
                </h2>
              </div>
            </div>

            <nav className="space-y-2">
              {workspaceTabs.map((item) => {
                const isActive = activeNav === item.label;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActiveNav(item.label)}
                    className={`flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-left text-[12px] font-semibold transition-colors ${
                      isActive
                        ? "bg-primary text-white shadow-soft"
                        : "bg-white text-ink-soft hover:bg-[#f6efe7]"
                    }`}
                  >
                    {item.label}

                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-[#f3eee5] text-ink-faint"
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <main className="space-y-5">
            <header className="flex flex-col gap-3 rounded-3xl border border-[#e9dfd2] bg-white p-4 shadow-soft md:flex-row md:items-center md:justify-between md:p-5">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#e2d9cc] bg-[#faf7f3] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
                  <MdDashboard size={14} />
                  Admin dashboard
                </div>

                <h1 className="font-display text-2xl font-bold text-primary-dark md:text-3xl">
                  {pageTitles[activeNav]}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#e9dfd2] bg-[#faf7f3] px-3 py-2 text-[11px] font-semibold text-ink-soft shadow-soft">
                  <MdNotifications size={15} className="text-[#b67318]" />
                  {pendingHubPosts} pending
                </div>

                <Link
                  to="/students-hub"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[12px] font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
                >
                  Open Students Hub
                  <MdArrowForward size={15} />
                </Link>
              </div>
            </header>

            {error && (
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#f4d2d2] bg-[#fff5f5] px-4 py-3 text-[12.5px] font-medium text-[#9b3a3a]">
                <span>{error}</span>

                <button
                  type="button"
                  onClick={loadOverview}
                  className="rounded-full border border-[#e6bebe] px-3 py-1 text-[11px]"
                >
                  Retry
                </button>
              </div>
            )}

            {sections[activeNav]}
          </main>
        </div>
      </div>
    </div>
  );
}
