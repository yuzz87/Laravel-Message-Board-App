import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getMyProfile } from "../api/profile";

type Profile = {
  id?: number;
  display_name: string;
  bio?: string | null;
  is_public: boolean;
  user?: {
    id: number;
    name?: string;
    email?: string;
  };
};

export default function MyProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError("");

        const res = await getMyProfile();

        if (res?.data) {
          setProfile(res.data);
        } else {
          setProfile(res);
        }
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

  return (
    <Layout title="My Profile">
      <section className="profile-section">
        {loading && <p>Loading...</p>}

        {!loading && error && <p className="auth-error">{error}</p>}

        {!loading && !error && profile && (
          <div className="profile-card">
            <div className="profile-row">
              <span className="profile-label">Display Name</span>
              <span>{profile.display_name}</span>
            </div>

            <div className="profile-row">
              <span className="profile-label">Bio</span>
              <span>{profile.bio || "未設定"}</span>
            </div>

            <div className="profile-row">
              <span className="profile-label">Public</span>
              <span>{profile.is_public ? "公開" : "非公開"}</span>
            </div>

            {profile.user?.name && (
              <div className="profile-row">
                <span className="profile-label">User Name</span>
                <span>{profile.user.name}</span>
              </div>
            )}

            <div className="profile-actions">
              <Link to="/profile/edit">Edit Profile</Link>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}