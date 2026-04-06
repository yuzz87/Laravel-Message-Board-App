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