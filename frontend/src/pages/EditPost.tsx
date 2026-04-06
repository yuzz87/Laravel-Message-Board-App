import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPost, updatePost } from "../api/posts";

export default function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setError("投稿IDがありません");
        setLoading(false);
        return;
      }

      try {
        const res = await getPost(Number(postId));
        setBody(res.data.body);
        setIsPublic(res.data.is_public);
      } catch (err) {
        console.error(err);
        setError("投稿の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    void fetchPost();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!postId) {
      setError("投稿IDがありません");
      return;
    }

    if (!body.trim()) {
      setError("本文を入力してください");
      return;
    }

    setSubmitting(true);

    try {
      await updatePost(Number(postId), {
        body,
        is_public: isPublic,
      });

      navigate("/my/posts");
    } catch (err) {
      console.error(err);
      setError("投稿更新に失敗しました");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error && !body) return <p>{error}</p>;

  return (
    <main style={{ padding: 16 }}>
      <h1>Edit Post</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 500 }}>
        <textarea
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          公開する
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? "更新中..." : "更新する"}
        </button>
      </form>

      {error && <p>{error}</p>}
    </main>
  );
}