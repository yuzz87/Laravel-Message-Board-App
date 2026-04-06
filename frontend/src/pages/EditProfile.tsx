import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getMyProfile, updateMyProfile } from "../api/profile";

type Profile = {
  display_name: string;
  bio?: string | null;
  is_public: boolean;
};

export default function EditProfile() {
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError("");

        const res = await getMyProfile();
        const profile: Profile = res?.data ?? res;

        setDisplayName(profile.display_name ?? "");
        setBio(profile.bio ?? "");
        setIsPublic(Boolean(profile.is_public));
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "プロフィール取得に失敗しました");
        } else {
          setError("プロフィール取得に失敗しました");
        }
      } finally {
        setLoading(false);
      }
    }

    void fetchProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await updateMyProfile({
        display_name: displayName,
        bio,
        is_public: isPublic,
      });

      navigate("/my-profile");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "プロフィール更新に失敗しました");
      } else {
        setError("プロフィール更新に失敗しました");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout title="Edit Profile">
      <section className="auth-section">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label htmlFor="display_name">Display Name</label>
              <input
                id="display_name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>

            <div className="auth-form-group">
              <label htmlFor="bio">Bio</label>
              <input
                id="bio"
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div className="checkbox-row">
              <label htmlFor="is_public">公開プロフィールにする</label>
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