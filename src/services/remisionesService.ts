const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4001/api";

export type Remision = {
  id_remision: number;
  id_servicio: number;
  folio?: string | null;
  subtotal?: number;
  total?: number;
  descripcion?: string | null;
  condiciones_garantia?: string | null;
  fecha_registro?: string;
  detalle_fallo?: string;
  cliente?: string;
  marca?: string;
  modelo?: string;
  placas?: string;
};

export type GuardarRemisionPayload = {
  id_servicio: number;
  folio?: string;
  subtotal: number;
  total: number;
  descripcion?: string;
  condiciones_garantia?: string;
};

type RemisionesResponse = {
  ok: boolean;
  remisiones: Remision[];
  msg?: string;
};

type RemisionResponse = {
  ok: boolean;
  remision?: Remision;
  msg?: string;
};

export async function obtenerRemisiones() {
  const response = await fetch(`${API_URL}/remisiones`);
  const data = (await response.json()) as RemisionesResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudieron cargar las remisiones");
  }

  return data.remisiones;
}

export async function crearRemision(payload: GuardarRemisionPayload) {
  const response = await fetch(`${API_URL}/remisiones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as RemisionResponse;

  if (!response.ok || !data.ok || !data.remision) {
    throw new Error(data.msg ?? "No se pudo registrar la remision");
  }

  return data.remision;
}

export async function actualizarRemision(id: number, payload: Partial<GuardarRemisionPayload>) {
  const response = await fetch(`${API_URL}/remisiones/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await response.json()) as RemisionResponse;

  if (!response.ok || !data.ok || !data.remision) {
    throw new Error(data.msg ?? "No se pudo actualizar la remision");
  }

  return data.remision;
}

export async function eliminarRemision(id: number) {
  const response = await fetch(`${API_URL}/remisiones/${id}`, { method: "DELETE" });
  const data = (await response.json()) as RemisionResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudo eliminar la remision");
  }
}
