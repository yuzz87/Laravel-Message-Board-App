import { api } from "./client";
import type { ApiSuccess } from "../types/api";
import type { Profile } from "../types/profile";

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

export async function getUserProfile(userId: number) {
  const res = await api.get<ApiSuccess<Profile>>(`/users/${userId}`);
  return res.data;
}