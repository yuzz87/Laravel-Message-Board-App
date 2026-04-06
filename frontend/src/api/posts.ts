import { api } from "./client";
import type { ApiSuccess } from "../types/api";
import type { Post } from "../types/post";

export async function getPosts() {
  const res = await api.get<ApiSuccess<Post[]>>("/posts");
  return res.data;
}

export type CreatePostRequest = {
  body: string;
  is_public: boolean;
};

export async function createPost(payload: CreatePostRequest) {
  const res = await api.post<ApiSuccess<Post>>("/posts", payload);
  return res.data;
}

export async function getMyPosts() {
  const res = await api.get<ApiSuccess<Post[]>>("/my/posts");
  return res.data;
}

export async function getPost(postId: number) {
  const res = await api.get<ApiSuccess<Post>>(`/posts/${postId}`);
  return res.data;
}

export type UpdatePostRequest = {
  body: string;
  is_public: boolean;
};

export async function updatePost(postId: number, payload: UpdatePostRequest) {
  const res = await api.patch<ApiSuccess<Post>>(`/posts/${postId}`, payload);
  return res.data;
}
export async function deletePost(postId: number) {
  const res = await api.delete(`/posts/${postId}`);
  return res.data;
}
export async function getUserPosts(userId: number) {
  const res = await api.get<ApiSuccess<Post[]>>(`/users/${userId}/posts`);
  return res.data;
}