const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4001/api";

export type Cliente = {
  id_cliente: number;
  nombre: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  activo?: number;
};

type ClientesResponse = {
  ok: boolean;
  clientes: Cliente[];
  msg?: string;
};

export async function obtenerClientes() {
  const response = await fetch(`${API_URL}/clientes`);
  const data = (await response.json()) as ClientesResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudieron cargar los clientes");
  }

  return data.clientes;
}
