const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";
const TOKEN_KEY = "taller_autos_token";
const USER_KEY = "taller_autos_user";

export type LoginCredentials = {
  email: string;
  password: string;
};

export type AuthUser = {
  id_usuario?: number;
  usuario_id?: number;
  id?: number;
  nombre?: string;
  correo?: string;
  usuario?: string;
  rol?: string;
};

type LoginResponse = {
  ok: boolean;
  token?: string;
  usuario?: AuthUser;
  msg?: string;
};

export async function login(credentials: LoginCredentials) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usuario: credentials.email,
      password: credentials.password,
    }),
  });

  const data = (await response.json()) as LoginResponse;

  if (!response.ok || !data.ok || !data.token) {
    throw new Error(data.msg ?? "No se pudo iniciar sesión");
  }

  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.usuario ?? null));

  return data;
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
