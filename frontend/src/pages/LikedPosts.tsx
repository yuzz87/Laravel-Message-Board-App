import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getLikedPosts, savePost, unlikePost, unsavePost } from "../api/posts";

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
  is_saved?: boolean;
  user?: PostUser;
};

export default function LikedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);
  const [likingId, setLikingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchLikedPosts() {
      try {
        setLoading(true);
        setError("");

        const res = await getLikedPosts();

        if (Array.isArray(res?.data)) {
          setPosts(res.data);
        } else if (Array.isArray(res)) {
          setPosts(res);
        } else {
          setPosts([]);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "いいね済み投稿一覧の取得に失敗しました");
        } else {
          setError("いいね済み投稿一覧の取得に失敗しました");
        }
      } finally {
        setLoading(false);
      }
    }

    void fetchLikedPosts();
  }, []);

  async function handleUnlike(postId: number) {
    try {
      setLikingId(postId);
      await unlikePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "いいね解除に失敗しました");
      } else {
        setError("いいね解除に失敗しました");
      }
    } finally {
      setLikingId(null);
    }
  }

  async function handleToggleSave(post: Post) {
    try {
      setSavingId(post.id);
      if (post.is_saved) {
        await unsavePost(post.id);
        setPosts((prev) => prev.map((item) => (item.id === post.id ? { ...item, is_saved: false } : item)));
        return;
      }

      await savePost(post.id);
      setPosts((prev) => prev.map((item) => (item.id === post.id ? { ...item, is_saved: true } : item)));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "保存操作に失敗しました");
      } else {
        setError("保存操作に失敗しました");
      }
    } finally {
      setSavingId(null);
    }
  }

  return (
    <Layout title="Liked Posts">
      <section className="posts-section">
        {loading && <p>Loading...</p>}
        {!loading && error && <p className="auth-error">{error}</p>}
        {!loading && !error && posts.length === 0 && <p>いいね済み投稿はまだありません。</p>}

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
                    <button type="button" onClick={() => void handleUnlike(post.id)} disabled={likingId === post.id}>
                      {likingId === post.id ? "Unliking..." : "Unlike"}
                    </button>
                    <button type="button" onClick={() => void handleToggleSave(post)} disabled={savingId === post.id}>
                      {post.is_saved ? "Unsave" : "Save"}
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
