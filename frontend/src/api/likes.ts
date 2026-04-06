import api from "./client";

type ApiSuccess<T> = {
  success?: boolean;
  data: T;
  message?: string;
};

type Post = {
  id: number;
  body: string;
  is_public: boolean;
  created_at?: string;
  likes_count?: number;
  is_liked?: boolean;
  user?: {
    id: number;
    name?: string;
    display_name?: string;
  };
};

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