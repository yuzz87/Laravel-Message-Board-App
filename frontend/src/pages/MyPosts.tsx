import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { deletePost, getMyPosts } from "../api/posts";

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

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchMyPosts() {
      try {
        setLoading(true);
        setError("");

        const res = await getMyPosts();

        if (Array.isArray(res?.data)) {
          setPosts(res.data);
        } else if (Array.isArray(res)) {
          setPosts(res);
        } else {
          setPosts([]);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "自分の投稿一覧の取得に失敗しました");
        } else {
          setError("自分の投稿一覧の取得に失敗しました");
        }
      } finally {
        setLoading(false);
      }
    }

    void fetchMyPosts();
  }, []);

  async function handleDelete(postId: number) {
    const shouldDelete = window.confirm("この投稿を削除しますか？");
    if (!shouldDelete) return;

    try {
      setDeletingId(postId);
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "投稿削除に失敗しました");
      } else {
        setError("投稿削除に失敗しました");
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Layout title="My Posts">
      <section className="posts-section">
        {loading && <p>Loading...</p>}
        {!loading && error && <p className="auth-error">{error}</p>}
        {!loading && !error && posts.length === 0 && <p>自分の投稿はまだありません。</p>}

        {!loading && !error && posts.length > 0 && (
          <div className="posts-list">
            {posts.map((post) => (
              <article key={post.id} className="post-card">
                <p className="post-card-body">{post.body}</p>

                <div className="post-card-meta">
                  <span>公開設定: {post.is_public ? "公開" : "非公開"}</span>
                  {typeof post.likes_count === "number" && (
                    <span>Likes: {post.likes_count}</span>
                  )}
                </div>

                <div className="post-card-links">
                  <Link to={`/posts/${post.id}/edit`}>Edit</Link>
                  <button type="button" onClick={() => void handleDelete(post.id)} disabled={deletingId === post.id}>
                    {deletingId === post.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
