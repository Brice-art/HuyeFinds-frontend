import { Link } from "react-router-dom";
import {
  MdCampaign,
  MdArrowForward,
  MdPushPin,
  MdChevronRight,
} from "react-icons/md";

import { useHubPosts } from "@/hooks/useApi";

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();

  if (diffMs < 0) return "Just now";

  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days}d ago`;

  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function PinnedAnnouncements() {
  const { data, loading } = useHubPosts("?pinned=true&limit=3");

  if (loading) {
    return (
      <section className="mb-8">
        <div className="overflow-hidden rounded-3xl border border-accent/30 bg-accent-tint">
          <div className="flex items-center gap-4 px-4 py-4 md:px-5">
            <div className="h-10 w-10 flex-none animate-pulse rounded-xl bg-white/60" />

            <div className="flex gap-3 overflow-hidden">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-14 w-56 flex-none animate-pulse rounded-2xl bg-white/60"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!data || data.items.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      {/* Section heading */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-tint text-primary-dark">
            <MdPushPin size={15} />
          </span>

          <div>
            <p className="font-display text-[13px] font-bold text-ink">
              Important on campus
            </p>
            <p className="text-[10px] text-ink-faint">
              Pinned announcements from your community
            </p>
          </div>
        </div>

        <span className="hidden text-[10px] font-medium text-ink-faint sm:block">
          {data.items.length} pinned
        </span>
      </div>

      {/* Announcement rail */}
      <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-accent-tint">
        <div className="flex gap-3 overflow-x-auto p-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {data.items.map((post, index) => (
            <Link
              key={post.id}
              to={`/students-hub/${post.id}`}
              className="group flex min-w-[280px] max-w-[360px] flex-1 items-center gap-3 rounded-2xl border border-white/70 bg-white/80 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-soft"
            >
              {/* Icon */}
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-primary text-white transition-transform duration-200 group-hover:scale-105">
                <MdCampaign size={19} />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex items-center gap-2">
                  {index === 0 && (
                    <span className="rounded-full bg-heart/10 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-heart">
                      Featured
                    </span>
                  )}

                  {post.isUrgent && (
                    <span className="rounded-full bg-heart px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wide text-white">
                      Urgent
                    </span>
                  )}
                </div>

                <h3 className="truncate text-[12px] font-bold text-ink transition-colors group-hover:text-primary">
                  {post.title}
                </h3>

                <p className="mt-0.5 text-[10px] text-ink-faint">
                  {timeAgo(post.createdAt)}
                </p>
              </div>

              {/* Arrow */}
              <MdChevronRight
                size={19}
                className="flex-none text-ink-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </Link>
          ))}
        </div>

        {/* Right fade */}
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 hidden w-12 bg-gradient-to-l from-accent-tint to-transparent md:block" />
      </div>

      {/* Mobile hint */}
      {data.items.length > 1 && (
        <div className="mt-2 flex items-center justify-end gap-1 text-[9.5px] text-ink-faint sm:hidden">
          Swipe to see more
          <MdArrowForward size={12} />
        </div>
      )}
    </section>
  );
}
