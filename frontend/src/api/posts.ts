import api from "./client";

type PostPayload = {
  body: string;
  is_public: boolean;
};

export async function getPosts() {
  const response = await api.get("/posts");
  return response.data;
}

export async function getPost(postId: string | number) {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
}

export async function createPost(payload: PostPayload) {
  const response = await api.post("/posts", payload);
  return response.data;
}

export async function updatePost(postId: string | number, payload: PostPayload) {
  const response = await api.patch(`/posts/${postId}`, payload);
  return response.data;
}

export async function deletePost(postId: string | number) {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
}

export async function getMyPosts() {
  const response = await api.get("/my/posts");
  return response.data;
}

export async function getSavedPosts() {
  const response = await api.get("/me/saved-posts");
  return response.data;
}

export async function getLikedPosts() {
  const response = await api.get("/me/liked-posts");
  return response.data;
}

export async function getUserPosts(userId: string | number) {
  const response = await api.get(`/users/${userId}/posts`);
  return response.data;
}

export async function savePost(postId: string | number) {
  const response = await api.post(`/posts/${postId}/save`);
  return response.data;
}

export async function unsavePost(postId: string | number) {
  const response = await api.delete(`/posts/${postId}/save`);
  return response.data;
}

export async function likePost(postId: string | number) {
  const response = await api.post(`/posts/${postId}/like`);
  return response.data;
}

export async function unlikePost(postId: string | number) {
  const response = await api.delete(`/posts/${postId}/like`);
  return response.data;
}
