import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";//children
import * as authApi from "../api/auth";
import { AuthContext } from "./auth-context";

type AuthUser = {
  id: number;
  name: string;
  email: string;
};

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));// localstorageから読み込んでいる
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const storedToken = localStorage.getItem("token");//token残し

      if (!storedToken) {
        setToken(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      setToken(storedToken);

      try {
        const me = await authApi.getMe();
        const meUser = me?.data ?? me?.user ?? me ?? null;
        setUser(meUser);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void bootstrap();
  }, []);
  //更新されるたびに、localstorageにtokenを保存している
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  async function login(email: string, password: string) {
    const result = await authApi.login(email, password);

    const receivedToken = result?.token ?? result?.data?.token ?? null;
    const receivedUser = result?.user ?? result?.data?.user ?? null;

    if (!receivedToken) {
      throw new Error("トークンを取得できませんでした");
    }

    setToken(receivedToken);
    setUser(receivedUser);
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
    }
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}