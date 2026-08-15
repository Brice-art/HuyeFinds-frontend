import { Link } from "react-router-dom";
import { useHubPosts } from "@/hooks/useApi";

export function PinnedAnnouncements() {
  const { data } = useHubPosts("?pinned=true&limit=3");

  if (!data || data.items.length === 0) return null;

  return (
    <div className="bg-accent-tint border border-accent/30 rounded-xl px-4 py-3 mb-5 flex items-center gap-4 overflow-x-auto">
      <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-primary-dark flex-none">
        📌 Pinned
      </span>
      {data.items.map((post) => (
        <Link
          key={post.id}
          to={`/students-hub/${post.id}`}
          className="flex-none text-[12.5px] text-ink-soft border-l border-accent/30 pl-4"
        >
          <span className="font-semibold text-ink block">{post.title}</span>
        </Link>
      ))}
    </div>
  );
}
