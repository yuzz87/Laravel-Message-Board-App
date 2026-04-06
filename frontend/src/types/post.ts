export type UserSummary = {
  id: number;
  name?: string;
  display_name?: string;
};

export type Post = {
  id: number;
  body: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user?: UserSummary;
  likes_count?: number;
  is_liked?: boolean;
  is_saved?: boolean;
};