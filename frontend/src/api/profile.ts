import api from "./client";

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

type ApiSuccess<T> = {
  success?: boolean;
  data: T;
  message?: string;
};

export async function getMyProfile() {
  const res = await api.get<ApiSuccess<Profile>>("/profile");
  return res.data;
}

export async function updateMyProfile(payload: {
  display_name: string;
  bio: string | null;
  is_public: boolean;
}) {
  const res = await api.patch<ApiSuccess<Profile>>("/profile", payload);
  return res.data;
}

export async function getUserProfile(userId: string | number) {
  const res = await api.get<ApiSuccess<Profile>>(`/users/${userId}`);
  return res.data;
}