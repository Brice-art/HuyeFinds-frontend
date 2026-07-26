import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import type { HubPost, HubPostType } from "@/types";

const TYPE_LABELS: Record<HubPostType, string> = {
  SIDE_HUSTLE: "Side Hustle",
  LOST_FOUND: "Lost & Found",
  EVENT: "Event",
  ANNOUNCEMENT: "Announcement",
};

const TYPE_STYLES: Record<HubPostType, { tint: string; fg: string }> = {
  SIDE_HUSTLE: { tint: "#E7F0EA", fg: "#1F4E3C" },
  LOST_FOUND: { tint: "#FDEAEA", fg: "#B4453A" },
  EVENT: { tint: "#E9E5FB", fg: "#5B4FA0" },
  ANNOUNCEMENT: { tint: "#DCEBFB", fg: "#2F6FB4" },
};

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

interface HubPostCardProps {
  post: HubPost;
  onDeleted?: () => void;
}

export function HubPostCard({ post, onDeleted }: HubPostCardProps) {
  const { user } = useAuth();
  const style = TYPE_STYLES[post.type];
  const isOwnPost = user?.id === post.authorId;

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/hub-posts/${post.id}`);
      onDeleted?.();
    } catch (err) {
      alert(
        err instanceof ApiError ? err.message : "Couldn't delete this post",
      );
    }
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-4 flex flex-col gap-2">
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
      <p className="text-[13px] text-ink-soft leading-relaxed">
        {post.description}
      </p>

      {post.eventDate && (
        <p className="text-[12px] text-primary font-semibold">
          📅{" "}
          {new Date(post.eventDate).toLocaleDateString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
        </p>
      )}
      {post.location && (
        <p className="text-[12px] text-ink-faint">📍 {post.location}</p>
      )}
      {post.contactPhone && (
        <p className="text-[12px] font-mono text-ink-soft">
          {post.contactPhone}
        </p>
      )}

      <div className="flex items-center justify-between mt-1 pt-2 border-t border-border">
        <span className="text-[11.5px] text-ink-faint">
          Posted by {post.author.name}
        </span>
        {isOwnPost && (
          <button
            onClick={handleDelete}
            className="text-[11.5px] font-semibold text-heart"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
