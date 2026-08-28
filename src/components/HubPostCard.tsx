import { Link } from "react-router-dom";
import {
  MdEvent,
  MdPlace,
  MdPhone,
  MdImage,
  MdVisibility,
  MdComment,
  MdFavorite,
  MdBookmarkBorder,
  MdWork,
  MdLocalOffer,
  MdSearch,
  MdCampaign,
  MdArrowForward,
} from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useState } from "react";

import { ShareButton } from "@/components/ShareButton";
import { useHubPostToggle } from "@/hooks/useHubPostToggle";
import { cld } from "@/lib/cloudinaryUrl";
import type { HubPost, HubPostType } from "@/types";

const TYPE_LABELS: Record<HubPostType, string> = {
  SIDE_HUSTLE: "Side Hustle",
  BUY_SELL: "Buy & Sell",
  LOST_FOUND: "Lost & Found",
  EVENT: "Event",
  ANNOUNCEMENT: "Announcement",
};

const TYPE_STYLES: Record<
  HubPostType,
  {
    tint: string;
    fg: string;
    icon: React.ReactNode;
  }
> = {
  SIDE_HUSTLE: {
    tint: "#E7F0EA",
    fg: "#1F4E3C",
    icon: <MdWork size={14} />,
  },
  BUY_SELL: {
    tint: "#FBE4C8",
    fg: "#B4762A",
    icon: <MdLocalOffer size={14} />,
  },
  LOST_FOUND: {
    tint: "#FDEAEA",
    fg: "#B4453A",
    icon: <MdSearch size={14} />,
  },
  EVENT: {
    tint: "#E9E5FB",
    fg: "#5B4FA0",
    icon: <MdEvent size={14} />,
  },
  ANNOUNCEMENT: {
    tint: "#DCEBFB",
    fg: "#2F6FB4",
    icon: <MdCampaign size={14} />,
  },
};

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
    year:
      new Date(dateStr).getFullYear() !== new Date().getFullYear()
        ? "numeric"
        : undefined,
  });
}

function formatEventDate(dateStr: string) {
  const date = new Date(dateStr);

  return {
    weekday: date.toLocaleDateString(undefined, {
      weekday: "short",
    }),
    day: date.toLocaleDateString(undefined, {
      day: "numeric",
    }),
    month: date.toLocaleDateString(undefined, {
      month: "short",
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

function isNewPost(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  return diff >= 0 && diff < 24 * 60 * 60 * 1000;
}

export function HubPostCard({ post }: { post: HubPost }) {
  const style = TYPE_STYLES[post.type];

  const { active: liked, toggle: toggleLike } = useHubPostToggle(
    post.id,
    "like",
    post.isLiked,
  );

  const [saved, setSaved] = useState(false);

  const cover = post.images?.[0]?.url;
  const newPost = isNewPost(post.createdAt);

  const authorIsAdmin = "role" in post.author && post.author.role === "ADMIN";

  function handleLikeClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    toggleLike();
  }

  function handleSaveClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    setSaved((current) => !current);
  }

  function handleContactClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (post.contactPhone) {
      window.location.href = `tel:${post.contactPhone}`;
    }
  }

  const eventDate = post.eventDate ? formatEventDate(post.eventDate) : null;

  return (
    <Link to={`/students-hub/${post.id}`}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lift cursor-pointer">
        <div
          className="absolute inset-0 z-0 cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary/30 rounded-2xl"
          aria-label={`View ${post.title}`}
        />

        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-accent-tint">
          {cover ? (
            <img
              src={cld(cover, 700)}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-faint">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface/80">
                <MdImage size={25} />
              </div>
              <span className="text-[11px]">No image added</span>
            </div>
          )}

          {/* Image overlay */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent opacity-60" />

          {/* Category */}
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10.5px] font-bold shadow-sm backdrop-blur-sm"
              style={{
                backgroundColor: style.tint,
                color: style.fg,
              }}
            >
              {style.icon}
              {TYPE_LABELS[post.type]}
            </span>

            {newPost && (
              <span className="rounded-full bg-white px-2.5 py-1.5 text-[10px] font-bold text-primary-dark shadow-sm">
                NEW
              </span>
            )}
          </div>

          {/* Urgent */}
          {post.isUrgent && (
            <span className="absolute right-3 top-3 rounded-full bg-heart px-2.5 py-1.5 text-[9.5px] font-bold tracking-wide text-white shadow-sm">
              URGENT
            </span>
          )}

          {/* Save + Share */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
            <ShareButton
              title={post.title}
              description={post.description}
              path={`/students-hub/${post.id}`}
            />
            <button
              type="button"
              onClick={handleSaveClick}
              aria-label={saved ? "Remove saved post" : "Save post"}
              aria-pressed={saved}
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/20 text-white backdrop-blur-md transition-all duration-200 hover:bg-black/40 active:scale-90 ${
                saved ? "bg-white text-primary-dark" : ""
              }`}
            >
              <MdBookmarkBorder
                size={19}
                className={saved ? "fill-current" : ""}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-1 flex-col p-4">
          {/* Author + time */}
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <div
                className="flex h-7 w-7 flex-none items-center justify-center rounded-full font-display text-[10px] font-bold"
                style={{
                  backgroundColor: style.tint,
                  color: style.fg,
                }}
              >
                {authorIsAdmin ? (
                  <FaUser size={10} />
                ) : (
                  post.author.name?.charAt(0).toUpperCase()
                )}
              </div>

              <span className="truncate text-[11.5px] font-medium text-ink-faint">
                {authorIsAdmin ? "University Admin" : post.author.name}
              </span>
            </div>

            <span className="flex-none text-[10.5px] text-ink-faint">
              {timeAgo(post.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h3 className="mb-1.5 line-clamp-2 text-[15px] font-bold leading-snug text-ink transition-colors group-hover:text-primary">
            {post.title}
          </h3>

          {/* BUY & SELL */}
          {post.type === "BUY_SELL" && (
            <>
              {post.price != null && (
                <div className="mb-2">
                  <span className="text-[16px] font-bold tracking-tight text-primary-dark">
                    {post.price.toLocaleString("en-RW")} RWF
                  </span>
                </div>
              )}

              <p className="mb-2.5 line-clamp-2 text-[12.5px] leading-relaxed text-ink-soft">
                {post.description}
              </p>
            </>
          )}

          {/* SIDE HUSTLE */}
          {post.type === "SIDE_HUSTLE" && (
            <>
              <p className="mb-2.5 line-clamp-2 text-[12.5px] leading-relaxed text-ink-soft">
                {post.description}
              </p>

              {post.price != null && (
                <span className="mb-2 inline-flex w-fit rounded-md bg-accent px-2.5 py-1 text-[11.5px] font-semibold text-primary-dark">
                  {post.price.toLocaleString("en-RW")} RWF
                </span>
              )}
            </>
          )}

          {/* EVENT */}
          {post.type === "EVENT" && (
            <>
              {eventDate && (
                <div className="mb-3 flex items-center gap-3 rounded-xl bg-accent-tint px-3 py-2.5">
                  <div className="flex h-10 w-10 flex-none flex-col items-center justify-center rounded-lg bg-surface text-center">
                    <span className="text-[8px] font-bold uppercase text-primary">
                      {eventDate.month}
                    </span>
                    <span className="text-[15px] font-bold leading-none text-primary-dark">
                      {eventDate.day}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11.5px] font-semibold text-primary-dark">
                      {eventDate.weekday}
                    </p>
                    <p className="text-[10.5px] text-ink-faint">
                      {eventDate.time}
                    </p>
                  </div>
                </div>
              )}

              <p className="mb-2.5 line-clamp-2 text-[12.5px] leading-relaxed text-ink-soft">
                {post.description}
              </p>
            </>
          )}

          {/* LOST & FOUND */}
          {post.type === "LOST_FOUND" && (
            <p className="mb-2.5 line-clamp-3 text-[12.5px] leading-relaxed text-ink-soft">
              {post.description}
            </p>
          )}

          {/* ANNOUNCEMENT */}
          {post.type === "ANNOUNCEMENT" && (
            <p className="mb-2.5 line-clamp-3 text-[12.5px] leading-relaxed text-ink-soft">
              {post.description}
            </p>
          )}

          {/* Location */}
          {post.location && (
            <div className="mb-3 flex min-w-0 items-center gap-1.5 text-[11px] text-ink-faint">
              <MdPlace
                size={15}
                className="flex-none"
                style={{ color: style.fg }}
              />
              <span className="truncate">{post.location}</span>
            </div>
          )}

          {/* Bottom section */}
          <div className="mt-auto border-t border-border pt-3">
            <div className="flex items-center justify-between gap-3">
              {/* Stats */}
              <div className="flex items-center gap-3 text-[11px] text-ink-faint">
                <span className="flex items-center gap-1">
                  <MdVisibility size={14} />
                  {post.viewCount}
                </span>

                <span className="flex items-center gap-1">
                  <MdComment size={14} />
                  {post.commentCount}
                </span>

                <button
                  type="button"
                  onClick={handleLikeClick}
                  aria-label={liked ? "Unlike post" : "Like post"}
                  aria-pressed={liked}
                  className={`relative z-20 flex items-center gap-1 transition-all duration-200 hover:text-heart active:scale-125 ${
                    liked ? "text-heart" : ""
                  }`}
                >
                  <MdFavorite
                    size={14}
                    className={`transition-transform duration-200 ${
                      liked ? "scale-110" : ""
                    }`}
                  />
                  {post.likeCount}
                </button>
              </div>

              {/* Quick action */}
              {post.contactPhone ? (
                <a
                  href={`tel:${post.contactPhone}`}
                  onClick={handleContactClick}
                  className="relative z-20 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[10.5px] font-semibold text-white transition-all hover:bg-primary-dark active:scale-95"
                >
                  <MdPhone size={13} />
                  Contact
                </a>
              ) : (
                <span className="flex items-center gap-0.5 text-[10.5px] font-semibold text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  View
                  <MdArrowForward size={13} />
                </span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
