const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4001/api";

export type HistorialItem = {
  id_historial: number;
  id_cliente: number;
  id_vehiculo: number;
  id_servicio: number;
  descripcion?: string | null;
  fecha: string;
  detalle_fallo?: string;
  cliente?: string;
  marca?: string;
  modelo?: string;
  placas?: string;
};

export type GuardarHistorialPayload = {
  id_servicio: number;
  descripcion?: string;
};

type HistorialResponse = {
  ok: boolean;
  historial: HistorialItem[];
  msg?: string;
};

type HistorialItemResponse = {
  ok: boolean;
  item?: HistorialItem;
  msg?: string;
};

export async function obtenerHistorial() {
  const response = await fetch(`${API_URL}/historial`);
  const data = (await response.json()) as HistorialResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudo cargar el historial");
  }

  return data.historial;
}

export async function crearHistorial(payload: GuardarHistorialPayload) {
  const response = await fetch(`${API_URL}/historial`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as HistorialItemResponse;

  if (!response.ok || !data.ok || !data.item) {
    throw new Error(data.msg ?? "No se pudo registrar el historial");
  }

  return data.item;
}

export async function actualizarHistorial(id: number, payload: Partial<GuardarHistorialPayload>) {
  const response = await fetch(`${API_URL}/historial/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as HistorialItemResponse;

  if (!response.ok || !data.ok || !data.item) {
    throw new Error(data.msg ?? "No se pudo actualizar el historial");
  }

  return data.item;
}

export async function eliminarHistorial(id: number) {
  const response = await fetch(`${API_URL}/historial/${id}`, { method: "DELETE" });
  const data = (await response.json()) as HistorialItemResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudo eliminar el historial");
  }
}
