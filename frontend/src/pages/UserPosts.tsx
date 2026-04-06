import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserPosts } from "../api/posts";
import type { Post } from "../types/post";

export default function UserPosts() {
  const { userId } = useParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!userId) {
        setError("ユーザーIDがありません");
        setLoading(false);
        return;
      }

      try {
        const res = await getUserPosts(Number(userId));
        console.log("user posts response:", res);
        setPosts(res.data);
      } catch (err) {
        console.error(err);
        setError("ユーザー投稿一覧の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    void fetchUserPosts();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <main style={{ padding: 16 }}>
      <h1>User Posts</h1>

      {posts.length === 0 && <p>このユーザーの公開投稿はありません</p>}

      {posts.map((post) => (
        <article
          key={post.id}
          style={{ border: "1px solid #ccc", marginBottom: 12, padding: 12 }}
        >
          <p>{post.body}</p>
          <small>公開設定: {post.is_public ? "公開" : "非公開"}</small>
        </article>
      ))}
    </main>
  );
}