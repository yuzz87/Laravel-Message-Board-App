export type Profile = {
  id: number;
  user_id: number;
  display_name: string;
  bio: string | null;
  is_public: boolean;
};