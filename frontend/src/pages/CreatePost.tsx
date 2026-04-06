import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";

export default function CreatePost() {
  const navigate = useNavigate();

  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!body.trim()) {
      setError("本文を入力してください");
      return;
    }

    setLoading(true);

    try {
      await createPost({
        body,
        is_public: isPublic,
      });

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("投稿作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 16 }}>
      <h1>Create Post</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 500 }}>
        <textarea
          rows={6}
          placeholder="投稿本文"
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

        <button type="submit" disabled={loading}>
          {loading ? "送信中..." : "投稿する"}
        </button>
      </form>

      {error && <p>{error}</p>}
    </main>
  );
}