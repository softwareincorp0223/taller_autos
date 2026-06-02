const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4001/api";

export type Vehiculo = {
  id_vehiculo: number;
  id_cliente: number;
  cliente?: string;
  marca: string;
  modelo: string;
  anio?: number;
  color?: string;
  placas?: string;
  numero_serie?: string;
  activo?: number;
  fecha_registro?: string;
};

export type GuardarVehiculoPayload = {
  id_cliente: number;
  marca: string;
  modelo: string;
  anio?: number | null;
  color?: string;
  placas?: string;
  numero_serie?: string;
  activo: number;
};

type VehiculosResponse = {
  ok: boolean;
  vehiculos: Vehiculo[];
  msg?: string;
};

type VehiculoResponse = {
  ok: boolean;
  vehiculo?: Vehiculo;
  msg?: string;
};

export async function obtenerVehiculos() {
  const response = await fetch(`${API_URL}/vehiculos`);
  const data = (await response.json()) as VehiculosResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudieron cargar los vehiculos");
  }

  return data.vehiculos;
}

export async function crearVehiculo(payload: GuardarVehiculoPayload) {
  const response = await fetch(`${API_URL}/vehiculos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as VehiculoResponse;

  if (!response.ok || !data.ok || !data.vehiculo) {
    throw new Error(data.msg ?? "No se pudo registrar el vehiculo");
  }

  return data.vehiculo;
}

export async function actualizarVehiculo(id: number, payload: Partial<GuardarVehiculoPayload>) {
  const response = await fetch(`${API_URL}/vehiculos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as VehiculoResponse;

  if (!response.ok || !data.ok || !data.vehiculo) {
    throw new Error(data.msg ?? "No se pudo actualizar el vehiculo");
  }

  return data.vehiculo;
}

export async function eliminarVehiculo(id: number) {
  const response = await fetch(`${API_URL}/vehiculos/${id}`, {
    method: "DELETE",
  });

  const data = (await response.json()) as VehiculoResponse;

  if (!response.ok || !data.ok) {
    throw new Error(data.msg ?? "No se pudo eliminar el vehiculo");
  }
}
