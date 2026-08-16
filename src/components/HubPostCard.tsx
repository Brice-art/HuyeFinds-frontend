import { Link } from "react-router-dom";
import { MdEvent, MdPlace, MdPhone, MdImage } from "react-icons/md";
import { useHubPostToggle } from "@/hooks/useHubPostToggle";
import { cld } from "@/lib/cloudinaryUrl";
import type { HubPost, HubPostType } from "@/types";
import { useAuth } from "@/lib/AuthContext";
import { FaUser } from 'react-icons/fa'; 

const TYPE_LABELS: Record<HubPostType, string> = {
  SIDE_HUSTLE: "Side Hustle",
  BUY_SELL: "Buy & Sell",
  LOST_FOUND: "Lost & Found",
  EVENT: "Event",
  ANNOUNCEMENT: "Announcement",
};

const TYPE_STYLES: Record<HubPostType, { tint: string; fg: string }> = {
  SIDE_HUSTLE: { tint: "#E7F0EA", fg: "#1F4E3C" },
  BUY_SELL: { tint: "#FBE4C8", fg: "#B4762A" },
  LOST_FOUND: { tint: "#FDEAEA", fg: "#B4453A" },
  EVENT: { tint: "#E9E5FB", fg: "#5B4FA0" },
  ANNOUNCEMENT: { tint: "#DCEBFB", fg: "#2F6FB4" },
};

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function HubPostCard({ post }: { post: HubPost }) {
  const style = TYPE_STYLES[post.type];
  const { active: liked, toggle: toggleLike } = useHubPostToggle(
    post.id,
    "like",
    post.isLiked,
  );
  const cover = post.images[0]?.url;

  function handleLikeClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleLike();
  }
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <Link
      to={`/students-hub/${post.id}`}
      className="block bg-surface border border-border rounded-lg overflow-hidden hover:shadow-lift hover:-translate-y-0.5 transition-all"
    >
      <div className="relative aspect-[16/10]">
        {cover ? (
          <>
            <img
              src={cld(cover, 500)}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover"
            />
            {post.isUrgent && (
              <span className="absolute top-2.5 right-2.5 bg-heart text-white text-[10px] font-bold px-2 py-1 rounded-full">
                URGENT
              </span>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-surface flex items-center justify-center text-ink-faint">
            <div className="flex items-center">
              <MdImage size={40} />
              <p>No Image</p> 
            </div>
            
            {post.isUrgent && (
              <span className="absolute top-2.5 right-2.5 bg-heart text-white text-[10px] font-bold px-2 py-1 rounded-full">
                URGENT
              </span>
            )}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span
            className="text-[10.5px] font-semibold px-2.5 py-1 rounded-full"
            style={{ background: style.tint, color: style.fg }}
          >
            {TYPE_LABELS[post.type]}
          </span>
          <span className="text-[11px] text-ink-faint">
            {timeAgo(post.createdAt)}
          </span>
        </div>

        <h3 className="text-[15px] font-semibold leading-snug">{post.title}</h3>
        <p className="text-[13px] text-ink-soft leading-relaxed line-clamp-2">
          {post.description}
        </p>

        {post.price != null && (
          <span className="price-tag inline-flex w-fit items-center gap-1.5 bg-accent text-primary-dark font-mono font-semibold text-[12.5px] py-1 pr-2.5 pl-3">
            {post.price.toLocaleString("en-RW")} RWF
          </span>
        )}

        {post.eventDate && (
          <p className="text-[12px] text-primary font-semibold flex items-center gap-2">
            <MdEvent className="text-primary" />
            {new Date(post.eventDate).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
        )}
        <div className="flex justify-between">
          {post.location && (
            <p className="text-[14px] text-ink-faint flex items-center gap-2"><MdPlace style={{ color: style.fg }} />{post.location}</p>
          )}
          {post.contactPhone && (
            <a
              href={`tel:${post.contactPhone}`}
              className="inline-flex items-center gap-2 text-[14px]"
            >
              <MdPhone /> {post.contactPhone}
            </a>
          )}
        </div>

        <div className="flex items-center justify-between mt-1 pt-2.5 border-t border-border">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-6 h-6 rounded-full bg-accent-tint text-primary-dark flex items-center justify-center font-display font-bold text-[10px] flex-none">
              {isAdmin ? <FaUser /> : post.author.name[0]}
            </div>
            <span className="text-[11.5px] text-ink-faint truncate">
              {isAdmin ? 'Admin' : post.author.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11.5px] text-ink-faint flex-none">
            <span className="flex items-center gap-1">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {post.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              {post.commentCount}
            </span>
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-1 ${liked ? "text-heart" : ""}`}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
              {post.likeCount}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
