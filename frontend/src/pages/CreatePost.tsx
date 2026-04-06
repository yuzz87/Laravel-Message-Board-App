import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { createPost } from "../api/posts";

export default function CreatePost() {
  const navigate = useNavigate();

  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await createPost({
        body,
        is_public: isPublic,
      });

      navigate("/my/posts");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "投稿作成に失敗しました");
      } else {
        setError("投稿作成に失敗しました");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout title="Create Post">
      <section className="auth-section">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="body">Post Body</label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="投稿内容を入力してください"
              rows={8}
              required
            />
          </div>

          <div className="checkbox-row">
            <label htmlFor="is_public">公開投稿にする</label>
            <input
              id="is_public"
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Post"}
          </button>
        </form>
      </section>
    </Layout>
  );
}