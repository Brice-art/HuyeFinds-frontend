import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  MdArrowBack,
  MdBookmark,
  MdBookmarkBorder,
  MdChatBubbleOutline,
  MdDeleteOutline,
  MdEdit,
  MdEvent,
  MdFavorite,
  MdFavoriteBorder,
  MdImage,
  MdLocationOn,
  MdPhone,
  MdSend,
} from "react-icons/md";

import { ShareButton } from "@/components/ShareButton";
import { useHubPost } from "@/hooks/useApi";
import { useHubPostToggle } from "@/hooks/useHubPostToggle";
import { useAuth } from "@/lib/AuthContext";
import { api, ApiError } from "@/lib/api";
import { cld } from "@/lib/cloudinaryUrl";
import type { HubPostComment, HubPostType } from "@/types";

const TYPE_LABELS: Record<HubPostType, string> = {
  BUY_SELL: "Buy & Sell",
  SIDE_HUSTLE: "Side Hustle",
  LOST_FOUND: "Lost & Found",
  EVENT: "Event",
  ANNOUNCEMENT: "Announcement",
};

const TYPE_STYLES: Record<HubPostType, { tint: string; fg: string }> = {
  SIDE_HUSTLE: {
    tint: "#E7F0EA",
    fg: "#1F4E3C",
  },
  BUY_SELL: {
    tint: "#FBE4C8",
    fg: "#B4762A",
  },
  LOST_FOUND: {
    tint: "#FDEAEA",
    fg: "#B4453A",
  },
  EVENT: {
    tint: "#E9E5FB",
    fg: "#5B4FA0",
  },
  ANNOUNCEMENT: {
    tint: "#DCEBFB",
    fg: "#2F6FB4",
  },
};

function timeAgo(dateStr: string) {
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

export function HubPostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    api
      .get<{ items: HubPostComment[] }>(`/hub-posts/${id}/comments`)
      .then((res) => setComments(res.items))
      .catch(() => setComments([]));
  }, [id]);

  async function handleCommentSubmit(e: FormEvent) {
    e.preventDefault();

    if (!commentBody.trim() || !id) return;

    setPostingComment(true);

    try {
      const newComment = await api.post<HubPostComment>(
        `/hub-posts/${id}/comments`,
        {
          body: commentBody.trim(),
        },
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
    if (!post) return;

    if (!confirm("Delete this post?")) return;

    try {
      await api.delete(`/hub-posts/${post.id}`);
      navigate("/students-hub");
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Couldn't delete post");
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-6">
        <div className="animate-pulse">
          <div className="mb-5 h-5 w-24 rounded bg-border" />
          <div className="aspect-[4/3] w-full rounded-2xl bg-border" />
          <div className="mt-4 h-5 w-24 rounded bg-border" />
          <div className="mt-2 h-8 w-3/4 rounded bg-border" />
          <div className="mt-3 h-5 w-32 rounded bg-border" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-10 text-center">
        <p className="text-sm text-heart">Couldn't load this post.</p>

        <button
          onClick={() => navigate("/students-hub")}
          className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white"
        >
          Back to Students Hub
        </button>
      </div>
    );
  }

  const typeStyle = TYPE_STYLES[post.type];

  const isOwnPost = user?.id === post.authorId;
  const isEditable = isOwnPost || user?.role === "ADMIN";

  const images = post.images ?? [];
  const currentImage = images[imageIndex]?.url;

  return (
    <div className="min-h-screen px-5 pb-10 pt-20 md:pt-24">
      <div className="mx-auto max-w-3xl">
        {/* Back */}
        <button
          onClick={() => navigate("/students-hub")}
          className="mb-4 flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-soft hover:text-primary"
        >
          <MdArrowBack size={17} />
          Back
        </button>

        {/* Photos */}
        <div className="relative overflow-hidden rounded-2xl bg-accent-tint">
          {currentImage ? (
            <img
              src={cld(currentImage, 1000)}
              alt={post.title}
              className="aspect-[4/3] w-full object-cover sm:aspect-[16/9]"
            />
          ) : (
            <div
              className="flex aspect-[4/3] items-center justify-center sm:aspect-[16/9]"
              style={{
                backgroundColor: typeStyle.tint,
                color: typeStyle.fg,
              }}
            >
              <MdImage size={42} />
            </div>
          )}

          {post.isUrgent && (
            <span className="absolute left-3 top-3 rounded-full bg-heart px-2.5 py-1 text-[9px] font-bold text-white">
              URGENT
            </span>
          )}

          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
              {imageIndex + 1}/{images.length}
            </div>
          )}
        </div>

        {/* Image thumbnails */}
        {images.length > 1 && (
          <div className="mt-2 flex gap-2 overflow-x-auto">
            {images.map((image, index) => (
              <button
                key={image.url}
                onClick={() => setImageIndex(index)}
                className={`h-14 w-14 flex-none overflow-hidden rounded-lg border-2 ${
                  imageIndex === index ? "border-primary" : "border-transparent"
                }`}
              >
                <img
                  src={cld(image.url, 120)}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Post content */}
        <div className="pt-5">
          {/* Type + time */}
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
              style={{
                backgroundColor: typeStyle.tint,
                color: typeStyle.fg,
              }}
            >
              {TYPE_LABELS[post.type]}
            </span>

            {post.isPinned && (
              <span className="rounded-full bg-accent-tint px-2.5 py-1 text-[10px] font-semibold text-primary-dark">
                Pinned
              </span>
            )}

            <span className="ml-auto text-[10.5px] text-ink-faint">
              {timeAgo(post.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h1 className="mt-2 font-display text-2xl font-bold leading-tight md:text-3xl">
            {post.title}
          </h1>

          {/* Price immediately visible */}
          {post.price != null && (
            <div className="mt-3">
              <span className="inline-flex items-baseline gap-1.5 rounded-xl bg-accent px-3.5 py-2">
                <span className="font-mono text-xl font-bold text-primary-dark">
                  {post.price.toLocaleString("en-RW")}
                </span>

                <span className="text-[11px] font-bold text-primary-dark">
                  RWF
                </span>
              </span>
            </div>
          )}

          {/* Description */}
          <p className="mt-4 whitespace-pre-wrap text-[13.5px] leading-6 text-ink-soft">
            {post.description}
          </p>

          {/* Details */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {post.eventDate && (
              <div className="flex items-center gap-1.5 text-[12px] font-semibold text-primary">
                <MdEvent size={17} />
                {new Date(post.eventDate).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            )}

            {post.location && (
              <div className="flex items-center gap-1.5 text-[12px] text-ink-soft">
                <MdLocationOn size={17} style={{ color: typeStyle.fg }} />
                {post.location}
              </div>
            )}

            {post.contactPhone && (
              <a
                href={`tel:${post.contactPhone}`}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-primary"
              >
                <MdPhone size={16} />
                {post.contactPhone}
              </a>
            )}
          </div>

          {/* Author */}
          <div className="mt-5 flex items-center gap-2.5 border-y border-border py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-tint font-display text-[11px] font-bold text-primary-dark">
              {post.author.name[0]?.toUpperCase()}
            </div>

            <span className="flex-1 text-[12px] text-ink-soft">
              Posted by <strong className="text-ink">{post.author.name}</strong>
            </span>

            <span className="text-[10px] text-ink-faint">
              {post.viewCount} views
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 border-b border-border py-2">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold ${
                liked
                  ? "bg-heart/10 text-heart"
                  : "text-ink-soft hover:bg-surface"
              }`}
            >
              {liked ? (
                <MdFavorite size={17} />
              ) : (
                <MdFavoriteBorder size={17} />
              )}
              {post.likeCount}
            </button>

            <span className="flex items-center gap-1.5 px-3 py-2 text-[12px] text-ink-soft">
              <MdChatBubbleOutline size={17} />
              {comments?.length ?? 0}
            </span>

            <button
              onClick={toggleSave}
              className={`ml-auto flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold ${
                saved ? "text-primary" : "text-ink-soft hover:bg-surface"
              }`}
            >
              {saved ? (
                <MdBookmark size={17} />
              ) : (
                <MdBookmarkBorder size={17} />
              )}
              {saved ? "Saved" : "Save"}
            </button>

            <ShareButton
              variant="inline"
              title={post.title}
              description={post.description}
              path={`/students-hub/${post.id}`}
            />

            {isEditable && (
              <>
                <button
                  onClick={() => navigate(`/students-hub/${post.id}/edit`)}
                  className="p-2 text-ink-faint hover:text-primary"
                  title="Edit"
                >
                  <MdEdit size={17} />
                </button>

                <button
                  onClick={handleDeletePost}
                  className="p-2 text-heart"
                  title="Delete"
                >
                  <MdDeleteOutline size={18} />
                </button>
              </>
            )}
          </div>

          {/* Comments */}
          <section className="pt-5">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="font-display text-base font-bold">Comments</h2>

              <span className="rounded-full bg-accent-tint px-2 py-0.5 text-[9px] font-semibold text-primary-dark">
                {comments?.length ?? 0}
              </span>
            </div>

            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-5 flex gap-2">
                <input
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  placeholder="Write a comment..."
                  maxLength={500}
                  className="min-w-0 flex-1 rounded-full border border-border bg-surface px-4 py-2.5 text-[12.5px] outline-none focus:border-primary"
                />

                <button
                  type="submit"
                  disabled={postingComment || !commentBody.trim()}
                  className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary text-white disabled:opacity-40"
                >
                  <MdSend size={17} />
                </button>
              </form>
            ) : (
              <p className="mb-5 text-[12px] text-ink-soft">
                <Link
                  to="/login"
                  state={{ from: location }}
                  className="font-semibold text-primary"
                >
                  Sign in
                </Link>{" "}
                to comment.
              </p>
            )}

            <div className="flex flex-col gap-3">
              {comments?.map((comment) => (
                <div key={comment.id} className="flex gap-2.5">
                  <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-primary-tint font-display text-[10px] font-bold text-primary">
                    {comment.author.name[0]?.toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <div className="text-[11.5px] font-semibold">
                      {comment.author.name}
                    </div>

                    <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-soft">
                      {comment.body}
                    </p>
                  </div>
                </div>
              ))}

              {comments?.length === 0 && (
                <p className="text-[12px] text-ink-faint">No comments yet.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
