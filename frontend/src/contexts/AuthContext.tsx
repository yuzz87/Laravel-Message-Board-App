import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { login as loginApi, logout as logoutApi, getMe } from "../api/auth";
import { AuthContext, type AuthContextType } from "./auth-context";

type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem("token");

      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await getMe();
        setUser(res.data);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void init();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginApi({ email, password });
    localStorage.setItem("token", res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await logoutApi();
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      isLoading,
      login,
      logout,
    }),
    [user, token, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}