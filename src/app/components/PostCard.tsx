import { MapPin, DollarSign } from 'lucide-react';
import { Post } from '../data/mockData';
import { StarRating } from './StarRating';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PostCardProps {
  post: Post;
  onClick: () => void;
}

function avgRating(r: Post['ratings']) {
  const vals = Object.values(r);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const avg = avgRating(post.ratings);
  const date = new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl overflow-hidden border border-border bg-card transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
      style={{ boxShadow: '0 1px 4px rgba(28,14,10,0.06)' }}
    >
      {/* Photo */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', background: '#F5EAE0' }}>
        <ImageWithFallback
          src={post.photos[0]}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        {/* Avg rating badge */}
        <div
          className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ background: 'rgba(255,248,242,0.92)', backdropFilter: 'blur(6px)' }}
        >
          <span style={{ fontSize: 13, color: '#F59340' }}>★</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#1C0E0A' }}>{avg.toFixed(1)}</span>
        </div>
        {/* Photo count */}
        {post.photos.length > 1 && (
          <div
            className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded-md"
            style={{ background: 'rgba(28,14,10,0.5)', color: '#fff', fontSize: 11 }}
          >
            +{post.photos.length - 1}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, color: '#1C0E0A', lineHeight: 1.3 }}>
            {post.title}
          </h3>
          <div
            className="shrink-0 flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: '#FDE8EF', color: '#C1415A', whiteSpace: 'nowrap' }}
          >
            <DollarSign size={11} />
            {post.price.toFixed(2)}
          </div>
        </div>

        <p className="text-xs font-medium mb-2" style={{ color: '#C1415A' }}>{post.shopName}</p>

        <div className="flex items-center gap-1 mb-3" style={{ color: '#8B6558', fontSize: 12 }}>
          <MapPin size={12} />
          <span>{post.city}, {post.state}</span>
          <span className="mx-1.5" style={{ opacity: 0.4 }}>·</span>
          <span>{date}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {post.flavors.map(f => (
            <span
              key={f}
              className="px-2 py-0.5 rounded-full text-xs"
              style={{ background: '#F5EAE0', color: '#8B6558' }}
            >
              {f}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <StarRating value={avg} size="sm" />
          <div className="flex gap-2">
            {post.reactions.slice(0, 3).map(r => (
              <span key={r.emoji} style={{ fontSize: 13 }}>
                {r.emoji} <span style={{ fontSize: 11, color: '#8B6558' }}>{r.count}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}
