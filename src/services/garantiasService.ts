const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4001/api";

export type Garantia = {
  id_garantia: number;
  id_servicio: number;
  detalle_garantia: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: "activa" | "vencida" | "cancelada";
  fecha_registro?: string;
  detalle_fallo?: string;
  cliente?: string;
  marca?: string;
  modelo?: string;
  placas?: string;
};

export type GuardarGarantiaPayload = {
  id_servicio: number;
  detalle_garantia: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
};

type GarantiasResponse = {
  ok: boolean;
  garantias: Garantia[];
  msg?: string;
};

type GarantiaResponse = {
  ok: boolean;
  garantia?: Garantia;
  msg?: string;
};

export async function obtenerGarantias() {
  const response = await fetch(`${API_URL}/garantias`);
  const data = (await response.json()) as GarantiasResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudieron cargar las garantias");
  }

  return data.garantias;
}

export async function crearGarantia(payload: GuardarGarantiaPayload) {
  const response = await fetch(`${API_URL}/garantias`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as GarantiaResponse;

  if (!response.ok || !data.ok || !data.garantia) {
    throw new Error(data.msg ?? "No se pudo registrar la garantia");
  }

  return data.garantia;
}

export async function actualizarGarantia(id: number, payload: Partial<GuardarGarantiaPayload>) {
  const response = await fetch(`${API_URL}/garantias/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as GarantiaResponse;

  if (!response.ok || !data.ok || !data.garantia) {
    throw new Error(data.msg ?? "No se pudo actualizar la garantia");
  }

  return data.garantia;
}

export async function eliminarGarantia(id: number) {
  const response = await fetch(`${API_URL}/garantias/${id}`, { method: "DELETE" });
  const data = (await response.json()) as GarantiaResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudo eliminar la garantia");
  }
}
