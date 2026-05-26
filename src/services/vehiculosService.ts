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
};

type VehiculosResponse = {
  ok: boolean;
  vehiculos: Vehiculo[];
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
