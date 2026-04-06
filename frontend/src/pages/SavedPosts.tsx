import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getSavedPosts, likePost, unlikePost, unsavePost } from "../api/posts";

type PostUser = {
  id: number;
  name?: string;
  display_name?: string;
};

type Post = {
  id: number;
  body: string;
  is_public: boolean;
  created_at?: string;
  likes_count?: number;
  is_liked?: boolean;
  user?: PostUser;
};

export default function SavedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [likingId, setLikingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchSavedPosts() {
      try {
        setLoading(true);
        setError("");

        const res = await getSavedPosts();

        if (Array.isArray(res?.data)) {
          setPosts(res.data);
        } else if (Array.isArray(res)) {
          setPosts(res);
        } else {
          setPosts([]);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "保存済み投稿一覧の取得に失敗しました");
        } else {
          setError("保存済み投稿一覧の取得に失敗しました");
        }
      } finally {
        setLoading(false);
      }
    }

    void fetchSavedPosts();
  }, []);

  async function handleUnsave(postId: number) {
    try {
      setSavingId(postId);
      await unsavePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "保存解除に失敗しました");
      } else {
        setError("保存解除に失敗しました");
      }
    } finally {
      setSavingId(null);
    }
  }

  async function handleToggleLike(post: Post) {
    try {
      setLikingId(post.id);
      if (post.is_liked) {
        await unlikePost(post.id);
        setPosts((prev) =>
          prev.map((item) =>
            item.id === post.id
              ? {
                  ...item,
                  is_liked: false,
                  likes_count:
                    typeof item.likes_count === "number" ? Math.max(0, item.likes_count - 1) : 0,
                }
              : item
          )
        );
        return;
      }

      await likePost(post.id);
      setPosts((prev) =>
        prev.map((item) =>
          item.id === post.id
            ? {
                ...item,
                is_liked: true,
                likes_count: typeof item.likes_count === "number" ? item.likes_count + 1 : 1,
              }
            : item
        )
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "いいね操作に失敗しました");
      } else {
        setError("いいね操作に失敗しました");
      }
    } finally {
      setLikingId(null);
    }
  }

  return (
    <Layout title="Saved Posts">
      <section className="posts-section">
        {loading && <p>Loading...</p>}
        {!loading && error && <p className="auth-error">{error}</p>}
        {!loading && !error && posts.length === 0 && <p>保存済み投稿はまだありません。</p>}

        {!loading && !error && posts.length > 0 && (
          <div className="posts-list">
            {posts.map((post) => (
              <article key={post.id} className="post-card">
                <p className="post-card-body">{post.body}</p>

                <div className="post-card-meta">
                  <span>
                    投稿者: {post.user?.display_name || post.user?.name || "Unknown User"}
                  </span>
                  {typeof post.likes_count === "number" && (
                    <span>Likes: {post.likes_count}</span>
                  )}
                </div>

                {post.user?.id && (
                  <div className="post-card-links">
                    <Link to={`/users/${post.user.id}`}>User Profile</Link>
                    <Link to={`/users/${post.user.id}/posts`}>User Posts</Link>
                    <button type="button" onClick={() => void handleUnsave(post.id)} disabled={savingId === post.id}>
                      {savingId === post.id ? "Unsaving..." : "Unsave"}
                    </button>
                    <button type="button" onClick={() => void handleToggleLike(post)} disabled={likingId === post.id}>
                      {post.is_liked ? "Unlike" : "Like"}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
