import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getLikedPosts } from "../api/posts";

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

export default function LikedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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