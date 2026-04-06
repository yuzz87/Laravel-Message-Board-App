import { api } from "./client";
import type { ApiSuccess } from "../types/api";
import type { Post } from "../types/post";

export async function getLikedPosts() {
  const res = await api.get<ApiSuccess<Post[]>>("/me/liked-posts");
  return res.data;
}

export async function likePost(postId: number) {
  const res = await api.post(`/posts/${postId}/like`);
  return res.data;
}

export async function unlikePost(postId: number) {
  const res = await api.delete(`/posts/${postId}/like`);
  return res.data;
}