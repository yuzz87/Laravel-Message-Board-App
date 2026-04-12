import api from "./client";
// 型形式の統一をする
// registerに型を作成する検討
type LoginResponse = {
  success?: boolean;
  token?: string;
  data?: {
    token?: string;
    user?: {
      id: number;
      name: string;
      email: string;
    };
  };
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export async function login(email: string, password: string) {
  const response = await api.post<LoginResponse>("/login", {
    email,
    password,
  });

  return response.data;
}

export async function register(payload: RegisterPayload) {
  const response = await api.post("/register", payload);
  return response.data;
}

export async function logout() {
  const response = await api.post("/logout");
  return response.data;
}

export async function getMe() {
  const response = await api.get("/me");
  return response.data;
}