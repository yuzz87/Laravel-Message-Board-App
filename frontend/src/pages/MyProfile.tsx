import { useEffect, useState } from "react";
import { getMyProfile } from "../api/profile";
import type { Profile } from "../types/profile";

export default function MyProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getMyProfile();
        setProfile(res.data);
      } catch {
        setError("プロフィール取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };

    void fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!profile) return <p>プロフィールがありません</p>;

  return (
    <main style={{ padding: 16 }}>
      <h1>MyProfile</h1>
      <p>表示名: {profile.display_name}</p>
      <p>自己紹介: {profile.bio ?? "なし"}</p>
      <p>公開設定: {profile.is_public ? "公開" : "非公開"}</p>
    </main>
  );
}