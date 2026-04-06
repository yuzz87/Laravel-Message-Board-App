import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserProfile } from "../api/profile";
import type { Profile } from "../types/profile";

export default function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setError("ユーザーIDがありません");
        setLoading(false);
        return;
      }

      try {
        const res = await getUserProfile(Number(userId));
        console.log("user profile response:", res);
        setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError("プロフィール取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    void fetchProfile();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>プロフィールがありません</p>;

  return (
    <main style={{ padding: 16 }}>
      <h1>User Profile</h1>

      <p>表示名: {profile.display_name}</p>
      <p>自己紹介: {profile.bio ?? "なし"}</p>
      <p>公開設定: {profile.is_public ? "公開" : "非公開"}</p>

      <div style={{ marginTop: 16 }}>
        <Link to={`/users/${userId}/posts`}>このユーザーの投稿を見る</Link>
      </div>
    </main>
  );
}