import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useHubPost } from "@/hooks/useApi";
import { useHubPostToggle } from "@/hooks/useHubPostToggle";
import { useAuth } from "@/lib/AuthContext";
import { api, ApiError } from "@/lib/api";
import { cld } from "@/lib/cloudinaryUrl";
import type { HubPostComment, HubPostType } from "@/types";

const TYPE_LABELS: Record<HubPostType, string> = {
  SIDE_HUSTLE: "Side Hustle",
  BUY_SELL: "Buy & Sell",
  LOST_FOUND: "Lost & Found",
  EVENT: "Event",
  ANNOUNCEMENT: "Announcement",
};

export function HubPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: post, loading, error } = useHubPost(id);
  const { active: liked, toggle: toggleLike } = useHubPostToggle(
    id ?? "",
    "like",
    post?.isLiked ?? false,
  );
  const { active: saved, toggle: toggleSave } = useHubPostToggle(
    id ?? "",
    "save",
    post?.isSaved ?? false,
  );

  const [comments, setComments] = useState<HubPostComment[] | null>(null);
  const [commentBody, setCommentBody] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .get<{ items: HubPostComment[] }>(`/hub-posts/${id}/comments`)
      .then((res) => setComments(res.items));
  }, [id]);

  async function handleCommentSubmit(e: FormEvent) {
    e.preventDefault();
    if (!commentBody.trim() || !id) return;

    setPostingComment(true);
    try {
      const newComment = await api.post<HubPostComment>(
        `/hub-posts/${id}/comments`,
        { body: commentBody.trim() },
      );
      setComments((prev) => [...(prev ?? []), newComment]);
      setCommentBody("");
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Couldn't post comment");
    } finally {
      setPostingComment(false);
    }
  }

  async function handleDeletePost() {
    if (!post || !confirm("Delete this post?")) return;
    await api.delete(`/hub-posts/${post.id}`);
    navigate("/students-hub");
  }

  if (loading)
    return (
      <p className="px-5 md:px-10 py-10 text-sm text-ink-faint">Loading…</p>
    );
  if (error || !post)
    return (
      <p className="px-5 md:px-10 py-10 text-sm text-heart">
        Couldn't load this post.
      </p>
    );

  const cover = post.images[0]?.url;
  const isOwnPost = user?.id === post.authorId;

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <button
        onClick={() => navigate(-1)}
        className="text-[13px] font-semibold text-ink-soft mb-4"
      >
        ← Back
      </button>

      {cover && (
        <img
          src={cld(cover, 900)}
          alt=""
          className="w-full aspect-[16/9] object-cover rounded-2xl mb-4"
        />
      )}

      <div className="flex items-center gap-2 mb-2">
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary-tint text-primary">
          {TYPE_LABELS[post.type]}
        </span>
        {post.isUrgent && (
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-heart text-white">
            URGENT
          </span>
        )}
        <span className="text-[11px] text-ink-faint ml-auto">
          {post.viewCount} views
        </span>
      </div>

      <h1 className="font-display text-2xl font-semibold mb-2">{post.title}</h1>

      {post.price != null && (
        <span className="price-tag inline-flex w-fit items-center gap-1.5 bg-accent text-primary-dark font-mono font-semibold text-sm py-1.5 pr-3.5 pl-4 mb-3">
          {post.price.toLocaleString("en-RW")} RWF
        </span>
      )}

      <p className="text-[14px] text-ink-soft leading-relaxed mb-4">
        {post.description}
      </p>

      {post.eventDate && (
        <p className="text-[13px] text-primary font-semibold mb-1.5">
          📅{" "}
          {new Date(post.eventDate).toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}
      {post.location && (
        <p className="text-[13px] text-ink-soft mb-1.5">📍 {post.location}</p>
      )}
      {post.contactPhone && (
        <a
          href={`tel:${post.contactPhone}`}
          className="inline-flex items-center gap-2 bg-primary text-white text-[13px] font-semibold px-4 py-2.5 rounded-full mb-4"
        >
          Call {post.contactPhone}
        </a>
      )}

      <div className="flex items-center gap-3 py-3 border-y border-border mb-2">
        <div className="w-8 h-8 rounded-full bg-accent-tint text-primary-dark flex items-center justify-center font-display font-bold text-xs flex-none">
          {post.author.name[0]}
        </div>
        <span className="text-[13px] text-ink-soft flex-1">
          Posted by {post.author.name}
        </span>

        <button
          onClick={toggleSave}
          className={`text-[12.5px] font-semibold ${saved ? "text-primary" : "text-ink-faint"}`}
        >
          {saved ? "★ Saved" : "☆ Save"}
        </button>
        <button
          onClick={toggleLike}
          className={`flex items-center gap-1 text-[12.5px] font-semibold ${liked ? "text-heart" : "text-ink-faint"}`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={liked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
          </svg>
          {post.likeCount}
        </button>

        {isOwnPost && (
          <button
            onClick={handleDeletePost}
            className="text-[12.5px] font-semibold text-heart"
          >
            Delete
          </button>
        )}
      </div>

      <h2 className="text-[15px] font-semibold mt-6 mb-3">
        Comments ({comments?.length ?? 0})
      </h2>

      {user ? (
        <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-4">
          <input
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder="Write a comment…"
            maxLength={500}
            className="flex-1 border border-border rounded-full px-4 py-2.5 text-[13px] outline-none focus:border-primary bg-surface"
          />
          <button
            type="submit"
            disabled={postingComment}
            className="bg-primary text-white text-[13px] font-semibold px-4 py-2.5 rounded-full disabled:opacity-60"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="text-[13px] text-ink-soft mb-4">
          <Link to="/login" className="text-primary font-semibold">
            Sign in
          </Link>{" "}
          to comment.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {comments?.map((c) => (
          <div key={c.id} className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-primary-tint text-primary flex items-center justify-center font-display font-bold text-[10px] flex-none">
              {c.author.name[0]}
            </div>
            <div>
              <div className="text-[12.5px] font-semibold">{c.author.name}</div>
              <p className="text-[13px] text-ink-soft">{c.body}</p>
            </div>
          </div>
        ))}
        {comments?.length === 0 && (
          <p className="text-[13px] text-ink-faint">No comments yet.</p>
        )}
      </div>
    </div>
  );
}
