import { useEffect, useState } from "react";
import { getLikedPosts, unlikePost } from "../api/likes";
import type { Post } from "../types/post";

export default function LikedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const res = await getLikedPosts();
        console.log("liked posts response:", res);
        setPosts(res.data);
      } catch (err) {
        console.error(err);
        setError("いいね済み投稿一覧の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    void fetchLikedPosts();
  }, []);

  const handleUnlike = async (postId: number) => {
    try {
      await unlikePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
    } catch (err) {
      console.error(err);
      setError("いいね解除に失敗しました");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main style={{ padding: 16 }}>
      <h1>Liked Posts</h1>

      {posts.length === 0 && <p>いいね済み投稿はありません</p>}

      {posts.map((post) => (
        <article
          key={post.id}
          style={{ border: "1px solid #ccc", marginBottom: 12, padding: 12 }}
        >
          <p>{post.body}</p>
          <small>公開設定: {post.is_public ? "公開" : "非公開"}</small>

          <div style={{ marginTop: 8 }}>
            <button onClick={() => void handleUnlike(post.id)}>
              いいね解除
            </button>
          </div>
        </article>
      ))}
    </main>
  );
}