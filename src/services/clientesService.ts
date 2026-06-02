const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4001/api";

export type Cliente = {
  id_cliente: number;
  nombre: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  activo?: number;
  fecha_registro?: string;
  total_vehiculos?: number;
  total_citas?: number;
  total_servicios?: number;
};

export type GuardarClientePayload = {
  nombre: string;
  telefono?: string;
  correo?: string;
  direccion?: string;
  activo: number;
};

type ClientesResponse = {
  ok: boolean;
  clientes: Cliente[];
  msg?: string;
};

type ClienteResponse = {
  ok: boolean;
  cliente?: Cliente;
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

export async function crearCliente(payload: GuardarClientePayload) {
  const response = await fetch(`${API_URL}/clientes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ClienteResponse;

  if (!response.ok || !data.ok || !data.cliente) {
    throw new Error(data.msg ?? "No se pudo registrar el cliente");
  }

  return data.cliente;
}

export async function actualizarCliente(id: number, payload: Partial<GuardarClientePayload>) {
  const response = await fetch(`${API_URL}/clientes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ClienteResponse;

  if (!response.ok || !data.ok || !data.cliente) {
    throw new Error(data.msg ?? "No se pudo actualizar el cliente");
  }

  return data.cliente;
}

export async function eliminarCliente(id: number) {
  const response = await fetch(`${API_URL}/clientes/${id}`, {
    method: "DELETE",
  });

  const data = (await response.json()) as ClienteResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudo eliminar el cliente");
  }
}
