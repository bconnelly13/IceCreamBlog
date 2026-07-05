import { Post } from "../../lib/postModels";
import { Plus, Pencil, MapPin, DollarSign, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AdminListProps {
  posts: Post[];
  onNewPost: () => void;
  onEditPost: (post: Post) => void;
}

function avgRating(r: Post["ratings"]) {
  const vals = Object.values(r);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function AdminList({ posts, onNewPost, onEditPost }: AdminListProps) {
  return (
    <div className="flex flex-col" style={{ minHeight: "100%" }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-4 flex items-center justify-between">
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              color: "#1C0E0A",
            }}
          >
            Manage Posts
          </h2>
          <p style={{ fontSize: 13, color: "#8B6558", marginTop: 2 }}>
            {posts.length} post{posts.length !== 1 ? "s" : ""} published
          </p>
        </div>
        <button
          onClick={onNewPost}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: "#C1415A", color: "#fff" }}
        >
          <Plus size={16} />
          New Post
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-3 border-t border-border" />

      {/* Posts list */}
      <div className="px-4 pb-6 space-y-3">
        {posts.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center gap-3">
            <span style={{ fontSize: 48 }}>📝</span>
            <p style={{ color: "#8B6558", fontSize: 15 }}>
              No posts yet. Create your first one!
            </p>
          </div>
        )}
        {posts.map((post) => {
          const avg = avgRating(post.ratings);
          const date = new Date(post.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          return (
            <button
              key={post.id}
              onClick={() => onEditPost(post)}
              className="w-full text-left flex gap-3 p-3 rounded-2xl border border-border bg-card transition-all hover:shadow-sm hover:border-primary/30 active:scale-[0.99]"
              style={{ boxShadow: "0 1px 3px rgba(28,14,10,0.05)" }}
            >
              {/* Thumbnail */}
              <div
                className="shrink-0 rounded-xl overflow-hidden"
                style={{ width: 72, height: 72, background: "#F5EAE0" }}
              >
                {post.photos[0] ? (
                  <ImageWithFallback
                    src={post.photos[0]}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span style={{ fontSize: 28 }}>🍦</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#1C0E0A",
                    lineHeight: 1.3,
                  }}
                  className="truncate"
                >
                  {post.title}
                </p>
                <p
                  style={{
                    fontSize: 12,
                    color: "#C1415A",
                    fontWeight: 500,
                    marginTop: 1,
                  }}
                  className="truncate"
                >
                  {post.shopName}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span
                    className="flex items-center gap-0.5"
                    style={{ fontSize: 11, color: "#8B6558" }}
                  >
                    <MapPin size={10} />
                    {post.city}, {post.state}
                  </span>
                  <span style={{ fontSize: 11, color: "#8B6558" }}>{date}</span>
                  <span
                    className="flex items-center gap-0.5"
                    style={{ fontSize: 11, color: "#F59340", fontWeight: 600 }}
                  >
                    <Star size={10} fill="#F59340" color="#F59340" />
                    {avg.toFixed(1)}
                  </span>
                  <span style={{ fontSize: 11, color: "#8B6558" }}>
                    <DollarSign size={9} style={{ display: "inline" }} />
                    {post.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Edit icon */}
              <div className="shrink-0 flex items-center">
                <div
                  className="p-2 rounded-xl"
                  style={{ background: "#F5EAE0" }}
                >
                  <Pencil size={14} color="#8B6558" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
