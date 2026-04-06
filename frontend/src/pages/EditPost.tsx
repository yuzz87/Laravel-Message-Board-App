import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getPost, updatePost } from "../api/posts";

type Post = {
  id: number;
  body: string;
  is_public: boolean;
};

export default function EditPost() {
  const navigate = useNavigate();
  const { postId } = useParams<{ postId: string }>();

  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      if (!postId) {
        setError("投稿IDがありません");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await getPost(postId);
        const post: Post = res?.data ?? res;

        setBody(post.body ?? "");
        setIsPublic(Boolean(post.is_public));
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "投稿取得に失敗しました");
        } else {
          setError("投稿取得に失敗しました");
        }
      } finally {
        setLoading(false);
      }
    }

    void fetchPost();
  }, [postId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!postId) {
      setError("投稿IDがありません");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await updatePost(postId, {
        body,
        is_public: isPublic,
      });

      navigate("/my/posts");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "投稿更新に失敗しました");
      } else {
        setError("投稿更新に失敗しました");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout title="Edit Post">
      <section className="auth-section">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label htmlFor="body">Post Body</label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
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
              {submitting ? "Saving..." : "Save"}
            </button>
          </form>
        )}
      </section>
    </Layout>
  );
}