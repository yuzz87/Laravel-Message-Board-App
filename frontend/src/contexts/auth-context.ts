import { createContext } from "react";// 共有

type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;//非同期
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);//初期値を作らなくてはいけない