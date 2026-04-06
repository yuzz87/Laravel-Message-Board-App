import { useEffect, useState } from "react";
import { getSavedPosts, unsavePost } from "../api/savedPosts";
import type { Post } from "../types/post";

export default function SavedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const res = await getSavedPosts();
        console.log("saved posts response:", res);
        setPosts(res.data);
      } catch (err) {
        console.error(err);
        setError("保存済み投稿一覧の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    void fetchSavedPosts();
  }, []);

  const handleUnsave = async (postId: number) => {
    try {
      await unsavePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      console.error(err);
      setError("保存解除に失敗しました");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main style={{ padding: 16 }}>
      <h1>Saved Posts</h1>

      {posts.length === 0 && <p>保存済み投稿はありません</p>}

      {posts.map((post) => (
        <article
          key={post.id}
          style={{ border: "1px solid #ccc", marginBottom: 12, padding: 12 }}
        >
          <p>{post.body}</p>
          <small>公開設定: {post.is_public ? "公開" : "非公開"}</small>

          <div style={{ marginTop: 8 }}>
            <button onClick={() => void handleUnsave(post.id)}>
              保存解除
            </button>
          </div>
        </article>
      ))}
    </main>
  );
}