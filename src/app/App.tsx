import { useState, useMemo } from 'react';
import { MOCK_POSTS, Post, TAG_OPTIONS } from './data/mockData';
import { NavBar } from './components/NavBar';
import { PostCard } from './components/PostCard';
import { PostDetail } from './components/PostDetail';
import { MapView } from './components/MapView';
import { FilterBar } from './components/FilterBar';
import { AdminEditor } from './components/AdminEditor';
import { AdminList } from './components/AdminList';
import { LoginModal } from './components/LoginModal';
import { IceCream2, LogIn, LogOut, User } from 'lucide-react';

type View = 'home' | 'map' | 'admin' | 'admin-new' | 'admin-edit' | 'post';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [search, setSearch] = useState('');
  const [flavorFilter, setFlavorFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);

  const allTags = useMemo(() => Array.from(new Set([...TAG_OPTIONS, ...customTags])).sort(), [customTags]);

  const allFlavors = useMemo(() => {
    const set = new Set<string>();
    posts.forEach(p => p.flavors.forEach(f => set.add(f)));
    return Array.from(set).sort();
  }, [posts]);

  const allStates = useMemo(() => Array.from(new Set(posts.map(p => p.state))).sort(), [posts]);

  const filteredPosts = useMemo(() => posts.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      p.shopName.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q) ||
      p.flavors.some(f => f.toLowerCase().includes(q)) ||
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.description.toLowerCase().includes(q);
    const matchFlavor = !flavorFilter || p.flavors.includes(flavorFilter);
    const matchState = !stateFilter || p.state === stateFilter;
    const matchTag = !tagFilter || p.tags.includes(tagFilter);
    return matchSearch && matchFlavor && matchState && matchTag;
  }), [posts, search, flavorFilter, stateFilter, tagFilter]);

  function handleLogin(adminStatus: boolean) {
    setIsLoggedIn(true);
    setIsAdmin(adminStatus);
    setShowLoginModal(false);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setIsAdmin(false);
    if (view === 'admin' || view === 'admin-new' || view === 'admin-edit') setView('home');
  }

  function openPost(post: Post) {
    setSelectedPost(post);
    setView('post');
  }

  function handlePublish(post: Post, newCustomTags?: string[]) {
    setPosts(prev => {
      const idx = prev.findIndex(p => p.id === post.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = post;
        return next;
      }
      return [post, ...prev];
    });
    if (newCustomTags?.length) {
      setCustomTags(prev => Array.from(new Set([...prev, ...newCustomTags])));
    }
    setView('admin');
  }

  function handleSetView(v: View) {
    if ((v === 'admin' || v === 'admin-new') && !isAdmin) {
      setShowLoginModal(true);
      return;
    }
    setView(v);
  }

  const showNav = view !== 'post';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100dvh', background: '#EDE0D4' }}>
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          background: '#FFF8F2',
          boxShadow: '0 0 60px rgba(28,14,10,0.15)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Top header */}
        {showNav && (
          <header
            className="flex items-center justify-between px-4 py-3 border-b border-border"
            style={{ background: '#FFF8F2', flexShrink: 0 }}
          >
            <button
              onClick={() => setView('home')}
              className="flex items-center gap-2 transition-opacity hover:opacity-75"
            >
              <IceCream2 size={22} color="#C1415A" />
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#1C0E0A', letterSpacing: '-0.02em' }}>
                The Scoop
              </span>
            </button>
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: '#FDE8EF', color: '#C1415A' }}>
                    <User size={12} />{isAdmin ? 'Admin' : 'Signed in'}
                  </div>
                  <button onClick={handleLogout} className="p-2 rounded-full transition-colors hover:bg-muted" title="Sign out">
                    <LogOut size={16} color="#8B6558" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-90"
                  style={{ background: '#C1415A', color: '#fff' }}
                >
                  <LogIn size={13} /> Sign in
                </button>
              )}
            </div>
          </header>
        )}

        {/* Content */}
        {view === 'map' ? (
          /* Map gets its own non-scrolling flex container */
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <MapView posts={posts} onPostClick={openPost} />
          </div>
        ) : view === 'post' && selectedPost ? (
          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
            <PostDetail
              post={selectedPost}
              onBack={() => setView('home')}
              isLoggedIn={isLoggedIn}
              onSignInPrompt={() => setShowLoginModal(true)}
            />
          </div>
        ) : (
          <main style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
            {view === 'home' && (
              <div>
                <div className="px-4 pt-5 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <IceCream2 size={18} color="#F59340" />
                    <span style={{ fontSize: 12, color: '#8B6558', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500 }}>
                      The Scoop Blog
                    </span>
                  </div>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#1C0E0A', lineHeight: 1.2 }}>
                    Chasing the best<br />
                    <span style={{ color: '#C1415A', fontStyle: 'italic' }}>ice cream</span> in America
                  </h1>
                </div>

                <FilterBar
                  search={search} setSearch={setSearch}
                  flavorFilter={flavorFilter} setFlavorFilter={setFlavorFilter}
                  stateFilter={stateFilter} setStateFilter={setStateFilter}
                  tagFilter={tagFilter} setTagFilter={setTagFilter}
                  flavors={allFlavors} states={allStates} tags={allTags}
                />

                {filteredPosts.length === 0 ? (
                  <div className="flex flex-col items-center py-16 px-8 text-center gap-3">
                    <span style={{ fontSize: 48 }}>🍦</span>
                    <p style={{ color: '#8B6558', fontSize: 15 }}>No posts match your search.</p>
                    <button onClick={() => { setSearch(''); setFlavorFilter(''); setStateFilter(''); setTagFilter(''); }}
                      className="text-sm px-4 py-2 rounded-full" style={{ background: '#FDE8EF', color: '#C1415A' }}>
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="px-4 pb-4 space-y-4">
                    <p style={{ fontSize: 12, color: '#8B6558' }}>
                      {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}{(search || flavorFilter || stateFilter || tagFilter) ? ' found' : ''}
                    </p>
                    {filteredPosts.map(post => (
                      <PostCard key={post.id} post={post} onClick={() => openPost(post)} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {(view === 'admin') && (
              isAdmin ? (
                <AdminList
                  posts={posts}
                  onNewPost={() => { setEditingPost(null); setView('admin-new'); }}
                  onEditPost={p => { setEditingPost(p); setView('admin-edit'); }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-4 pt-20">
                  <span style={{ fontSize: 48 }}>🔒</span>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: '#1C0E0A' }}>Admin only</h2>
                  <p style={{ color: '#8B6558', fontSize: 15 }}>Sign in with the admin account to manage posts.</p>
                  <button onClick={() => setShowLoginModal(true)}
                    className="px-6 py-3 rounded-2xl font-semibold text-sm"
                    style={{ background: '#C1415A', color: '#fff' }}>
                    Sign in
                  </button>
                </div>
              )
            )}

            {(view === 'admin-new' || view === 'admin-edit') && isAdmin && (
              <AdminEditor
                key={editingPost?.id ?? 'new'}
                initialPost={editingPost ?? undefined}
                allTags={allTags}
                onPublish={handlePublish}
                onCancel={() => setView('admin')}
              />
            )}
          </main>
        )}

        {/* Bottom nav */}
        {showNav && (
          <NavBar
            currentView={view}
            setView={handleSetView}
            isAdmin={isAdmin}
          />
        )}
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}
