import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getUserProfile } from "../api/profile";

type UserProfileData = {
  id?: number;
  display_name: string;
  bio?: string | null;
  is_public: boolean;
  user?: {
    id: number;
    name?: string;
  };
};

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();

  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUserProfile() {
      if (!userId) {
        setError("ユーザーIDがありません");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await getUserProfile(userId);
        const data = res?.data ?? res;
        setProfile(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "ユーザープロフィールの取得に失敗しました");
        } else {
          setError("ユーザープロフィールの取得に失敗しました");
        }
      } finally {
        setLoading(false);
      }
    }

    void fetchUserProfile();
  }, [userId]);

  return (
    <Layout title="User Profile">
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

            {userId && (
              <div className="profile-actions">
                <Link to={`/users/${userId}/posts`}>User Posts</Link>
              </div>
            )}
          </div>
        )}
      </section>
    </Layout>
  );
}