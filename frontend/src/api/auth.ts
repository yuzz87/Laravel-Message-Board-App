import { api } from "./client";
import type { ApiSuccess } from "../types/api";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponseData = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export async function login(payload: LoginRequest) {
  const res = await api.post<ApiSuccess<LoginResponseData>>("/login", payload);
  return res.data;
}

export async function logout() {
  const res = await api.post<ApiSuccess<null>>("/logout");
  return res.data;
}

export async function getMe() {
  const res = await api.get("/me");
  return res.data;
}
export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type RegisterResponseData = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export async function register(payload: RegisterRequest) {
  const res = await api.post<ApiSuccess<RegisterResponseData>>("/register", payload);
  return res.data;
}