import { api } from "./client";
import type { ApiSuccess } from "../types/api";
import type { Post } from "../types/post";

export async function getSavedPosts() {
  const res = await api.get<ApiSuccess<Post[]>>("/me/saved-posts");
  return res.data;
}

export async function savePost(postId: number) {
  const res = await api.post(`/posts/${postId}/save`);
  return res.data;
}

export async function unsavePost(postId: number) {
  const res = await api.delete(`/posts/${postId}/save`);
  return res.data;
}