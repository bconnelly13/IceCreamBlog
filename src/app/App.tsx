import { useEffect, useMemo, useState } from "react";
import { Post, TAG_OPTIONS } from "../lib/postModels";
import { NavBar } from "./components/NavBar";
import { PostCard } from "./components/PostCard";
import { PostDetail } from "./components/PostDetail";
import { MapView } from "./components/MapView";
import { FilterBar } from "./components/FilterBar";
import { AdminEditor } from "./components/AdminEditor";
import { AdminList } from "./components/AdminList";
import { LoginModal } from "./components/LoginModal";
import { Feedback } from "./components/Feedback";
import { IceCream2, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { fetchPosts, upsertPost } from "../lib/posts";

type RouteState = {
  postId?: string;
};

type AppRoute =
  | { kind: "home" }
  | { kind: "map" }
  | { kind: "feedback" }
  | { kind: "post"; postId: string }
  | { kind: "admin" }
  | { kind: "admin-editor"; postId?: string };

const ADMIN_EDITOR_SESSION_KEY = "icecreamblog.admin-editor-post-id";

function getStoredAdminEditorPostId() {
  if (typeof window === "undefined") return undefined;
  return window.sessionStorage.getItem(ADMIN_EDITOR_SESSION_KEY) ?? undefined;
}

function setStoredAdminEditorPostId(postId?: string) {
  if (typeof window === "undefined") return;
  if (postId) {
    window.sessionStorage.setItem(ADMIN_EDITOR_SESSION_KEY, postId);
  } else {
    window.sessionStorage.removeItem(ADMIN_EDITOR_SESSION_KEY);
  }
}

function readRouteFromLocation(): AppRoute {
  if (typeof window === "undefined") return { kind: "home" };

  const path = window.location.pathname;
  const state = (window.history.state ?? {}) as RouteState;

  if (path === "/map") return { kind: "map" };
  if (path === "/feedback") return { kind: "feedback" };
  if (path.startsWith("/post/")) {
    const postId = decodeURIComponent(path.slice("/post/".length));
    return postId ? { kind: "post", postId } : { kind: "home" };
  }
  if (path === "/admin") return { kind: "admin" };
  if (path === "/admin/post") {
    return {
      kind: "admin-editor",
      postId: state.postId ?? getStoredAdminEditorPostId(),
    };
  }

  return { kind: "home" };
}

function routeToPath(route: AppRoute) {
  switch (route.kind) {
    case "home":
      return "/";
    case "map":
      return "/map";
    case "feedback":
      return "/feedback";
    case "post":
      return `/post/${encodeURIComponent(route.postId)}`;
    case "admin":
      return "/admin";
    case "admin-editor":
      return "/admin/post";
  }
}

export default function App() {
  const { isLoggedIn, isAdmin, signOut } = useAuth();
  const [route, setRoute] = useState<AppRoute>(() => readRouteFromLocation());
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [flavorFilter, setFlavorFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [starFilters, setStarFilters] = useState<number[]>([]);
  const [customTags, setCustomTags] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    async function loadPosts() {
      try {
        setLoadError("");
        setLoadingPosts(true);
        const nextPosts = await fetchPosts();
        if (!active) return;
        setPosts(nextPosts);
      } catch (error) {
        if (!active) return;
        setLoadError(
          error instanceof Error ? error.message : "Failed to load posts.",
        );
      } finally {
        if (active) setLoadingPosts(false);
      }
    }

    loadPosts();

    return () => {
      active = false;
    };
  }, []);

  const allTags = useMemo(
    () => Array.from(new Set([...TAG_OPTIONS, ...customTags])).sort(),
    [customTags],
  );

  const allFlavors = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => p.flavors.forEach((f) => set.add(f)));
    return Array.from(set).sort();
  }, [posts]);

  const allStates = useMemo(
    () => Array.from(new Set(posts.map((p) => p.state))).sort(),
    [posts],
  );

  useEffect(() => {
    const handlePopState = () => {
      setRoute(readRouteFromLocation());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (route.kind !== "admin-editor" && getStoredAdminEditorPostId()) {
      setStoredAdminEditorPostId(undefined);
    }
  }, [route.kind]);

  function navigate(nextRoute: AppRoute, options?: { replace?: boolean }) {
    const nextPath = routeToPath(nextRoute);
    const nextState: RouteState =
      nextRoute.kind === "admin-editor" && nextRoute.postId
        ? { postId: nextRoute.postId }
        : {};

    if (nextRoute.kind === "admin-editor") {
      setStoredAdminEditorPostId(nextRoute.postId);
    } else {
      setStoredAdminEditorPostId(undefined);
    }

    window.history[options?.replace ? "replaceState" : "pushState"](
      nextState,
      "",
      nextPath,
    );
    setRoute(nextRoute);
  }

  const selectedPost = useMemo(
    () =>
      route.kind === "post"
        ? (posts.find((p) => p.id === route.postId) ?? null)
        : null,
    [posts, route],
  );

  const editingPost = useMemo(
    () =>
      route.kind === "admin-editor" && route.postId
        ? (posts.find((p) => p.id === route.postId) ?? null)
        : null,
    [posts, route],
  );

  const filteredPosts = useMemo(
    () =>
      posts.filter((p) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.shopName.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.flavors.some((f) => f.toLowerCase().includes(q)) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q);
        const matchFlavor = !flavorFilter || p.flavors.includes(flavorFilter);
        const matchState = !stateFilter || p.state === stateFilter;
        const matchTag = !tagFilter || p.tags.includes(tagFilter);

        // Calculate average rating
        const ratingsVals = Object.values(p.ratings);
        const avg = ratingsVals.reduce((a, b) => a + b, 0) / ratingsVals.length;
        const starCount = Math.floor(avg);
        const matchStars = starFilters.length === 0 || starFilters.includes(starCount);

        return matchSearch && matchFlavor && matchState && matchTag && matchStars;
      }),
    [posts, search, flavorFilter, stateFilter, tagFilter, starFilters],
  );

  async function handleLogout() {
    await signOut();
    if (route.kind === "admin" || route.kind === "admin-editor") {
      navigate({ kind: "home" }, { replace: true });
    }
  }

  function openPost(post: Post) {
    navigate({ kind: "post", postId: post.id });
  }

  async function handlePublish(post: Post, newCustomTags?: string[]) {
    await upsertPost(post);
    const nextPosts = await fetchPosts();
    setPosts(nextPosts);
    if (newCustomTags?.length) {
      setCustomTags((prev) => Array.from(new Set([...prev, ...newCustomTags])));
    }
    navigate({ kind: "admin" }, { replace: true });
  }

  function handleNavigate(path: string) {
    if (path.startsWith("/admin") && !isAdmin) {
      setShowLoginModal(true);
      return;
    }
    if (path === "/") {
      navigate({ kind: "home" });
      return;
    }
    if (path === "/map") {
      navigate({ kind: "map" });
      return;
    }
    if (path === "/feedback") {
      navigate({ kind: "feedback" });
      return;
    }
    if (path === "/admin") {
      navigate({ kind: "admin" });
      return;
    }
    if (path === "/admin/post") {
      navigate({ kind: "admin-editor" });
    }
  }

  const currentPath = routeToPath(route);
  const showNav = route.kind !== "post";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100dvh",
        background: "#EDE0D4",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          background: "#FFF8F2",
          boxShadow: "0 0 60px rgba(28,14,10,0.15)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Top header */}
        {showNav && (
          <header
            className="flex items-center justify-between px-4 py-3 border-b border-border"
            style={{ background: "#FFF8F2", flexShrink: 0 }}
          >
            <button
              onClick={() => navigate({ kind: "home" })}
              className="flex items-center gap-2 transition-opacity hover:opacity-75"
            >
              <IceCream2 size={22} color="#C1415A" />
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#1C0E0A",
                  letterSpacing: "-0.02em",
                }}
              >
                The Scoop
              </span>
            </button>
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <>
                  <div
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ background: "#FDE8EF", color: "#C1415A" }}
                  >
                    <User size={12} />
                    {isAdmin ? "Admin" : "Signed in"}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full transition-colors hover:bg-muted"
                    title="Sign out"
                  >
                    <LogOut size={16} color="#8B6558" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors hover:opacity-90"
                  style={{ background: "#C1415A", color: "#fff" }}
                >
                  <LogIn size={13} /> Sign in
                </button>
              )}
            </div>
          </header>
        )}

        {/* Content */}
        {route.kind === "map" ? (
          /* Map gets its own non-scrolling flex container */
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <MapView posts={posts} onPostClick={openPost} />
          </div>
        ) : route.kind === "post" ? (
          <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
            {selectedPost ? (
              <PostDetail
                post={selectedPost}
                onBack={() => navigate({ kind: "home" })}
                isLoggedIn={isLoggedIn}
                onSignInPrompt={() => setShowLoginModal(true)}
              />
            ) : (
              <div className="flex h-full items-center justify-center px-8 text-center">
                <p style={{ color: "#8B6558", fontSize: 15 }}>
                  That post could not be found.
                </p>
              </div>
            )}
          </div>
        ) : (
          <main style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none" }}>
            {route.kind === "feedback" && <Feedback />}

            {route.kind === "home" && (
              <div>
                <div className="px-4 pt-5 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <IceCream2 size={18} color="#F59340" />
                    <span
                      style={{
                        fontSize: 12,
                        color: "#8B6558",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      The Scoop Blog
                    </span>
                  </div>
                  <h1
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#1C0E0A",
                      lineHeight: 1.2,
                    }}
                  >
                    Chasing the best
                    <br />
                    <span style={{ color: "#C1415A", fontStyle: "italic" }}>
                      ice cream
                    </span>{" "}
                    in America
                  </h1>
                </div>

                <FilterBar
                  search={search}
                  setSearch={setSearch}
                  flavorFilter={flavorFilter}
                  setFlavorFilter={setFlavorFilter}
                  stateFilter={stateFilter}
                  setStateFilter={setStateFilter}
                  tagFilter={tagFilter}
                  setTagFilter={setTagFilter}
                  starFilters={starFilters}
                  setStarFilters={setStarFilters}
                  flavors={allFlavors}
                  states={allStates}
                  tags={allTags}
                />

                {loadingPosts ? (
                  <div className="px-4 pb-4 space-y-3">
                    <div
                      className="h-6 w-32 rounded-full"
                      style={{ background: "#F5EAE0" }}
                    />
                    <div
                      className="h-32 rounded-3xl"
                      style={{ background: "#F5EAE0" }}
                    />
                    <div
                      className="h-32 rounded-3xl"
                      style={{ background: "#F5EAE0" }}
                    />
                  </div>
                ) : loadError ? (
                  <div className="px-4 pb-4 py-8 text-center">
                    <p style={{ color: "#C1415A", fontSize: 14 }}>
                      {loadError}
                    </p>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="flex flex-col items-center py-16 px-8 text-center gap-3">
                    <span style={{ fontSize: 48 }}>🍦</span>
                    <p style={{ color: "#8B6558", fontSize: 15 }}>
                      No posts match your search.
                    </p>
                    <button
                      onClick={() => {
                        setSearch("");
                        setFlavorFilter("");
                        setStateFilter("");
                        setTagFilter("");
                        setStarFilters([]);
                      }}
                      className="text-sm px-4 py-2 rounded-full"
                      style={{ background: "#FDE8EF", color: "#C1415A" }}
                    >
                      Clear filters
                    </button>
                  </div>
                ) : (
                  <div className="px-4 pb-4 space-y-4">
                    <p style={{ fontSize: 12, color: "#8B6558" }}>
                      {filteredPosts.length} post
                      {filteredPosts.length !== 1 ? "s" : ""}
                      {search || flavorFilter || stateFilter || tagFilter
                        ? " found"
                        : ""}
                    </p>
                    {filteredPosts.map((post) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        onClick={() => openPost(post)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {(route.kind === "admin" || route.kind === "admin-editor") &&
              (isAdmin ? (
                route.kind === "admin" ? (
                  <AdminList
                    posts={posts}
                    onNewPost={() => {
                      navigate({ kind: "admin-editor" });
                    }}
                    onEditPost={(p) => {
                      navigate({ kind: "admin-editor", postId: p.id });
                    }}
                  />
                ) : (
                  <AdminEditor
                    key={editingPost?.id ?? "new"}
                    initialPost={editingPost ?? undefined}
                    allTags={allTags}
                    onPublish={handlePublish}
                    onCancel={() => navigate({ kind: "admin" })}
                  />
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-4 pt-20">
                  <span style={{ fontSize: 48 }}>🔒</span>
                  <h2
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "#1C0E0A",
                    }}
                  >
                    Admin only
                  </h2>
                  <p style={{ color: "#8B6558", fontSize: 15 }}>
                    Sign in with the admin account to manage posts.
                  </p>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-6 py-3 rounded-2xl font-semibold text-sm"
                    style={{ background: "#C1415A", color: "#fff" }}
                  >
                    Sign in
                  </button>
                </div>
              ))}
          </main>
        )}

        {/* Bottom nav */}
        {showNav && (
          <NavBar
            currentPath={currentPath}
            onNavigate={handleNavigate}
            isAdmin={isAdmin}
          />
        )}
      </div>

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => setShowLoginModal(false)}
        />
      )}
    </div>
  );
}
