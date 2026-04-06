import { useEffect, useState } from "react";
import { getPosts } from "../api/posts";
import { savePost } from "../api/savedPosts";
import { likePost } from "../api/likes";
import type { Post } from "../types/post";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPosts();
        setPosts(res.data);
      } catch (err) {
        console.error(err);
        setError("投稿一覧の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    void fetchPosts();
  }, []);

  const handleSave = async (postId: number) => {
    try {
      await savePost(postId);
      alert("保存しました");
    } catch (err) {
      console.error(err);
      alert("保存に失敗しました");
    }
  };

  const handleLike = async (postId: number) => {
    try {
      await likePost(postId);
      alert("いいねしました");
    } catch (err) {
      console.error(err);
      alert("いいねに失敗しました");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main style={{ padding: 16 }}>
      <h1>Home</h1>

      {posts.length === 0 && <p>投稿がありません</p>}

      {posts.map((post) => (
        <article
          key={post.id}
          style={{ border: "1px solid #ccc", marginBottom: 12, padding: 12 }}
        >
          <p>{post.body}</p>
          <small>公開設定: {post.is_public ? "公開" : "非公開"}</small>

          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button onClick={() => void handleSave(post.id)}>保存</button>
            <button onClick={() => void handleLike(post.id)}>いいね</button>
          </div>
        </article>
      ))}
    </main>
  );
}