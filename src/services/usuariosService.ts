import { getAuthToken } from "@/services/authService";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4001/api";

export type Usuario = {
  id_usuario: number;
  nombre: string;
  usuario: string;
  rol: "admin" | "recepcion";
  activo: number;
  fecha_registro?: string;
};

export type CrearUsuarioPayload = {
  nombre: string;
  usuario: string;
  password: string;
  rol: string;
  activo: number;
};

type UsuariosResponse = {
  ok: boolean;
  usuarios: Usuario[];
  msg?: string;
};

type UsuarioResponse = {
  ok: boolean;
  usuario?: Usuario;
  msg?: string;
};

const authHeaders = () => {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function obtenerUsuarios() {
  const response = await fetch(`${API_URL}/usuarios`);
  const data = (await response.json()) as UsuariosResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudieron cargar los usuarios");
  }

  return data.usuarios;
}

export async function crearUsuario(payload: CrearUsuarioPayload) {
  const response = await fetch(`${API_URL}/usuarios`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as UsuarioResponse;

  if (!response.ok || !data.ok || !data.usuario) {
    throw new Error(data.msg ?? "No se pudo registrar el usuario");
  }

  return data.usuario;
}

export async function eliminarUsuario(id: number) {
  const response = await fetch(`${API_URL}/usuarios/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = (await response.json()) as UsuarioResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudo eliminar el usuario");
  }
}
