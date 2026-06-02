const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4001/api";

export type Servicio = {
  id_servicio: number;
  id_cliente: number;
  id_vehiculo: number;
  id_cita?: number | null;
  detalle_fallo: string;
  diagnostico?: string | null;
  servicio_realizado?: string | null;
  costo?: number;
  estado: "pendiente" | "diagnostico" | "reparacion" | "terminado" | "entregado";
  garantia_activa?: number;
  fecha_inicio?: string;
  fecha_termino?: string | null;
  cliente?: string;
  marca?: string;
  modelo?: string;
  placas?: string;
  fecha_cita?: string | null;
  hora_cita?: string | null;
};

export type GuardarServicioPayload = {
  id_cliente: number;
  id_vehiculo: number;
  id_cita?: number | null;
  detalle_fallo: string;
  diagnostico?: string;
  servicio_realizado?: string;
  costo: number;
  estado: string;
  garantia_activa: number;
  fecha_termino?: string | null;
};

type ServiciosResponse = {
  ok: boolean;
  servicios: Servicio[];
  msg?: string;
};

type ServicioResponse = {
  ok: boolean;
  servicio?: Servicio;
  msg?: string;
};

export async function obtenerServicios() {
  const response = await fetch(`${API_URL}/servicios`);
  const data = (await response.json()) as ServiciosResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudieron cargar los servicios");
  }

  return data.servicios;
}

export async function crearServicio(payload: GuardarServicioPayload) {
  const response = await fetch(`${API_URL}/servicios`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ServicioResponse;

  if (!response.ok || !data.ok || !data.servicio) {
    throw new Error(data.msg ?? "No se pudo registrar el servicio");
  }

  return data.servicio;
}

export async function actualizarServicio(id: number, payload: Partial<GuardarServicioPayload>) {
  const response = await fetch(`${API_URL}/servicios/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as ServicioResponse;

  if (!response.ok || !data.ok || !data.servicio) {
    throw new Error(data.msg ?? "No se pudo actualizar el servicio");
  }

  return data.servicio;
}

export async function eliminarServicio(id: number) {
  const response = await fetch(`${API_URL}/servicios/${id}`, {
    method: "DELETE",
  });

  const data = (await response.json()) as ServicioResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudo eliminar el servicio");
  }
}
