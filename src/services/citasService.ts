import { getAuthToken } from "@/services/authService";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4001/api";

export type Cita = {
  id_cita: number;
  id_cliente: number;
  id_vehiculo: number;
  fecha: string;
  hora: string;
  tipo_ingreso: "cita" | "sin_cita";
  estado: "pendiente" | "confirmada" | "en_proceso" | "terminada" | "cancelada";
  observaciones?: string;
  recordatorio_enviado?: number;
  whatsapp_enviado?: number;
  fecha_registro?: string;
  cliente?: string;
  marca?: string;
  modelo?: string;
  placas?: string;
};

export type GuardarCitaPayload = {
  id_cliente: number;
  id_vehiculo: number;
  fecha: string;
  hora: string;
  tipo_ingreso: string;
  estado: string;
  observaciones?: string;
};

type CitasResponse = {
  ok: boolean;
  citas: Cita[];
  msg?: string;
};

type CitaResponse = {
  ok: boolean;
  cita?: Cita;
  msg?: string;
};

const authHeaders = () => {
  const token = getAuthToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function obtenerCitas() {
  const response = await fetch(`${API_URL}/citas`);
  const data = (await response.json()) as CitasResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudieron cargar las citas");
  }

  return data.citas;
}

export async function crearCita(payload: GuardarCitaPayload) {
  const response = await fetch(`${API_URL}/citas`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as CitaResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudo registrar la cita");
  }

  return data.cita;
}

export async function actualizarCita(id: number, payload: Partial<GuardarCitaPayload>) {
  const response = await fetch(`${API_URL}/citas/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as CitaResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudo actualizar la cita");
  }

  return data.cita;
}

export async function eliminarCita(id: number) {
  const response = await fetch(`${API_URL}/citas/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  const data = (await response.json()) as CitaResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudo eliminar la cita");
  }
}
