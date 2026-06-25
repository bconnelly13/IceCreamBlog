import { useState } from 'react';
import { ArrowLeft, MapPin, DollarSign, Calendar, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { Post } from '../data/mockData';
import { StarRating, RatingRow } from './StarRating';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
  isLoggedIn: boolean;
  onSignInPrompt: () => void;
}

const REACTION_EMOJIS = ['🍦', '❤️', '😍', '😋', '🌟', '🥰', '🤤', '👏'];

export function PostDetail({ post, onBack, isLoggedIn, onSignInPrompt }: PostDetailProps) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [reactions, setReactions] = useState(post.reactions);
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());

  const date = new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const avgRating = Object.values(post.ratings).reduce((a, b) => a + b, 0) / Object.values(post.ratings).length;

  function handleReact(emoji: string) {
    if (!isLoggedIn) { onSignInPrompt(); return; }
    const already = userReactions.has(emoji);
    setUserReactions(prev => {
      const next = new Set(prev);
      already ? next.delete(emoji) : next.add(emoji);
      return next;
    });
    setReactions(prev => {
      const existing = prev.find(r => r.emoji === emoji);
      if (existing) {
        return prev.map(r => r.emoji === emoji ? { ...r, count: r.count + (already ? -1 : 1) } : r);
      }
      return [...prev, { emoji, count: 1 }];
    });
    setShowEmojiPicker(false);
  }

  function handleComment() {
    if (!isLoggedIn) { onSignInPrompt(); return; }
    if (!commentText.trim()) return;
    setComments(prev => [...prev, {
      id: `c${Date.now()}`,
      author: 'You',
      avatar: 'Y',
      text: commentText.trim(),
      date: new Date().toISOString().split('T')[0],
      reactions: [],
    }]);
    setCommentText('');
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Photo carousel */}
      <div className="relative" style={{ aspectRatio: '4/3', maxHeight: 340, background: '#F5EAE0', flexShrink: 0 }}>
        <ImageWithFallback
          src={post.photos[photoIdx]}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 flex items-center gap-1 px-3 py-2 rounded-full"
          style={{ background: 'rgba(255,248,242,0.92)', backdropFilter: 'blur(8px)' }}
        >
          <ArrowLeft size={16} color="#1C0E0A" />
        </button>
        {post.photos.length > 1 && (
          <>
            {photoIdx > 0 && (
              <button onClick={() => setPhotoIdx(i => i - 1)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,248,242,0.85)' }}>
                <ChevronLeft size={18} color="#1C0E0A" />
              </button>
            )}
            {photoIdx < post.photos.length - 1 && (
              <button onClick={() => setPhotoIdx(i => i + 1)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,248,242,0.85)' }}>
                <ChevronRight size={18} color="#1C0E0A" />
              </button>
            )}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {post.photos.map((_, i) => (
                <button key={i} onClick={() => setPhotoIdx(i)}
                  className="rounded-full transition-all"
                  style={{ width: i === photoIdx ? 20 : 6, height: 6, background: i === photoIdx ? '#C1415A' : 'rgba(255,255,255,0.7)' }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex-1 px-4 py-5 space-y-5">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold mb-1" style={{ color: '#C1415A' }}>{post.shopName}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: '#1C0E0A', lineHeight: 1.25 }}>
            {post.title}
          </h1>

          {/* Metadata — vertical layout */}
          <div className="mt-3 space-y-2">
            <MetaRow icon={<MapPin size={14} color="#8B6558" />} label="Location">
              {post.address}, {post.city}, {post.state}
            </MetaRow>
            <MetaRow icon={<Calendar size={14} color="#8B6558" />} label="Visited">
              {date}
            </MetaRow>
            <MetaRow icon={<DollarSign size={14} color="#C1415A" />} label="Price per scoop">
              <span style={{ color: '#C1415A', fontWeight: 600 }}>${post.price.toFixed(2)}</span>
            </MetaRow>
          </div>
        </div>

        {/* Flavors */}
        <div>
          <SectionLabel>Flavors</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {post.flavors.map(f => (
              <span key={f} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: '#FDE8EF', color: '#C1415A' }}>
                🍦 {f}
              </span>
            ))}
          </div>
        </div>

        {/* Ratings */}
        <div className="rounded-2xl p-4 border border-border" style={{ background: '#FFFAF6' }}>
          <div className="flex items-center justify-between mb-3">
            <SectionLabel>Ratings</SectionLabel>
            <div className="flex items-center gap-1.5">
              <StarRating value={avgRating} size="sm" />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#F59340' }}>{avgRating.toFixed(1)}</span>
            </div>
          </div>
          <div className="space-y-2">
            <RatingRow label="Taste" value={post.ratings.taste} />
            <RatingRow label="Vibe" value={post.ratings.vibe} />
            <RatingRow label="Location" value={post.ratings.location} />
            <RatingRow label="Value" value={post.ratings.value} />
            <RatingRow label="Presentation" value={post.ratings.presentation} />
          </div>
        </div>

        {/* Description */}
        <div>
          <SectionLabel>The Visit</SectionLabel>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: '#3A1C14' }}>{post.description}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map(t => (
            <span key={t} className="px-2.5 py-1 rounded-full text-xs" style={{ background: '#F5EAE0', color: '#8B6558' }}>
              #{t}
            </span>
          ))}
        </div>

        {/* Reactions */}
        <div>
          <SectionLabel>Reactions</SectionLabel>
          <div className="flex flex-wrap gap-2 items-center">
            {reactions.filter(r => r.count > 0).map(r => (
              <button
                key={r.emoji}
                onClick={() => handleReact(r.emoji)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all"
                style={{
                  background: userReactions.has(r.emoji) ? '#FDE8EF' : '#FFFAF6',
                  borderColor: userReactions.has(r.emoji) ? '#C1415A' : 'rgba(139,101,88,0.2)',
                  fontSize: 14,
                }}
              >
                {r.emoji} <span style={{ fontSize: 12, color: '#8B6558' }}>{r.count}</span>
              </button>
            ))}
            <div className="relative">
              <button
                onClick={() => isLoggedIn ? setShowEmojiPicker(!showEmojiPicker) : onSignInPrompt()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed text-sm transition-all hover:border-primary"
                style={{ borderColor: 'rgba(139,101,88,0.3)', color: '#8B6558' }}
              >
                + React
              </button>
              {showEmojiPicker && (
                <div
                  className="absolute bottom-10 left-0 flex flex-wrap gap-2 p-3 rounded-2xl border border-border z-10"
                  style={{ background: '#FFFFFF', boxShadow: '0 8px 24px rgba(28,14,10,0.12)', width: 200 }}
                >
                  {REACTION_EMOJIS.map(e => (
                    <button key={e} onClick={() => handleReact(e)} className="text-xl hover:scale-125 transition-transform">
                      {e}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Comments */}
        <div>
          <SectionLabel>Comments ({comments.length})</SectionLabel>
          <div className="space-y-3 mb-4">
            {comments.map(c => (
              <div key={c.id} className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ background: '#FDE8EF', color: '#C1415A' }}>
                  {c.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#1C0E0A' }}>{c.author}</span>
                    <span style={{ fontSize: 11, color: '#8B6558' }}>{c.date}</span>
                  </div>
                  <p style={{ fontSize: 14, color: '#3A1C14', lineHeight: 1.5 }}>{c.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2 items-end">
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onFocus={() => !isLoggedIn && onSignInPrompt()}
              placeholder={isLoggedIn ? "Share your thoughts…" : "Sign in to comment"}
              rows={2}
              className="flex-1 px-3 py-2.5 rounded-xl border border-border outline-none focus:border-primary resize-none text-sm transition-colors"
              style={{ background: '#FDF0E8', color: '#1C0E0A', fontFamily: 'var(--font-body)' }}
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim()}
              className="p-2.5 rounded-xl transition-all"
              style={{ background: commentText.trim() ? '#C1415A' : '#F5EAE0', color: commentText.trim() ? '#fff' : '#8B6558' }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#8B6558' }}>
      {children}
    </p>
  );
}

function MetaRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p style={{ fontSize: 11, color: '#8B6558', marginBottom: 1, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {label}
        </p>
        <p style={{ fontSize: 14, color: '#1C0E0A' }}>{children}</p>
      </div>
    </div>
  );
}
