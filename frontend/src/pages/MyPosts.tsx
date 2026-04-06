import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deletePost, getMyPosts } from "../api/posts";
import type { Post } from "../types/post";

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyPosts = async () => {
    try {
      const res = await getMyPosts();
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      setError("自分の投稿一覧の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMyPosts();
  }, []);

  const handleDelete = async (postId: number) => {
    const ok = window.confirm("この投稿を削除しますか？");
    if (!ok) return;

    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      console.error(err);
      setError("投稿削除に失敗しました");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main style={{ padding: 16 }}>
      <h1>My Posts</h1>

      {posts.length === 0 && <p>自分の投稿はまだありません</p>}

      {posts.map((post) => (
        <article
          key={post.id}
          style={{ border: "1px solid #ccc", marginBottom: 12, padding: 12 }}
        >
          <p>{post.body}</p>
          <small>公開設定: {post.is_public ? "公開" : "非公開"}</small>

          <div style={{ marginTop: 8, display: "flex", gap: 12 }}>
            <Link to={`/posts/${post.id}/edit`}>編集</Link>
            <button onClick={() => void handleDelete(post.id)}>削除</button>
          </div>
        </article>
      ))}
    </main>
  );
}