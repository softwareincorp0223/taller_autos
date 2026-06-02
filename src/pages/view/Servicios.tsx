import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import DataTable, { type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { obtenerClientes, type Cliente } from "@/services/clientesService";
import { obtenerVehiculos, type Vehiculo } from "@/services/vehiculosService";
import { obtenerCitas, type Cita } from "@/services/citasService";
import {
  actualizarServicio,
  crearServicio,
  eliminarServicio,
  obtenerServicios,
  type Servicio,
} from "@/services/serviciosService";
import { confirmAction, confirmDelete, notifyError, notifySuccess } from "@/services/alertService";

type ServicioForm = {
  id_cliente: string;
  id_vehiculo: string;
  id_cita: string;
  detalle_fallo: string;
  diagnostico: string;
  servicio_realizado: string;
  costo: string;
  estado: string;
  garantia_activa: string;
  fecha_termino: string;
};

const initialForm: ServicioForm = {
  id_cliente: "",
  id_vehiculo: "",
  id_cita: "",
  detalle_fallo: "",
  diagnostico: "",
  servicio_realizado: "",
  costo: "0",
  estado: "pendiente",
  garantia_activa: "1",
  fecha_termino: "",
};

const selectClassName =
  "border-input bg-transparent flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

const estadoLabels: Record<string, string> = {
  pendiente: "Pendiente",
  diagnostico: "Diagnostico",
  reparacion: "Reparacion",
  terminado: "Terminado",
  entregado: "Entregado",
};

function formatDate(value?: string | null) {
  if (!value) return "";
  return value.includes("T") ? value.split("T")[0] : value.slice(0, 10);
}

function formatDateTime(value?: string | null) {
  if (!value) return "";
  const normalized = value.replace(" ", "T");
  return normalized.slice(0, 16);
}

export default function Servicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [citas, setCitas] = useState<Cita[]>([]);
  const [form, setForm] = useState<ServicioForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const vehiculosDisponibles = useMemo(() => {
    if (!form.id_cliente) return vehiculos;
    return vehiculos.filter((vehiculo) => String(vehiculo.id_cliente) === form.id_cliente);
  }, [form.id_cliente, vehiculos]);

  const citasDisponibles = useMemo(() => {
    return citas.filter((cita) => {
      const mismoCliente = !form.id_cliente || String(cita.id_cliente) === form.id_cliente;
      const mismoVehiculo = !form.id_vehiculo || String(cita.id_vehiculo) === form.id_vehiculo;
      return mismoCliente && mismoVehiculo;
    });
  }, [citas, form.id_cliente, form.id_vehiculo]);

  const cargarDatos = async () => {
    try {
      setError("");
      const [serviciosData, clientesData, vehiculosData, citasData] = await Promise.all([
        obtenerServicios(),
        obtenerClientes(),
        obtenerVehiculos(),
        obtenerCitas(),
      ]);

      setServicios(serviciosData);
      setClientes(clientesData);
      setVehiculos(vehiculosData);
      setCitas(citasData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const columns: Column<Servicio>[] = [
    { key: "cliente", label: "Cliente" },
    {
      key: "vehiculo",
      label: "Vehiculo",
      render: (row) => `${row.marca ?? ""} ${row.modelo ?? ""} ${row.placas ? `(${row.placas})` : ""}`,
      searchableValue: (row) => `${row.marca ?? ""} ${row.modelo ?? ""} ${row.placas ?? ""}`,
    },
    { key: "detalle_fallo", label: "Fallo" },
    {
      key: "costo",
      label: "Costo",
      render: (row) => `$${Number(row.costo ?? 0).toFixed(2)}`,
      searchableValue: (row) => String(row.costo ?? 0),
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => estadoLabels[row.estado] ?? row.estado,
      searchableValue: (row) => estadoLabels[row.estado] ?? row.estado,
    },
    {
      key: "garantia_activa",
      label: "Garantia",
      render: (row) => row.garantia_activa ? "Activa" : "Sin garantia",
      searchableValue: (row) => row.garantia_activa ? "Activa" : "Sin garantia",
    },
  ];

  const updateField = (name: keyof ServicioForm, value: string) => {
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "id_cliente" ? { id_vehiculo: "", id_cita: "" } : {}),
      ...(name === "id_vehiculo" ? { id_cita: "" } : {}),
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        id_cliente: Number(form.id_cliente),
        id_vehiculo: Number(form.id_vehiculo),
        id_cita: form.id_cita ? Number(form.id_cita) : null,
        detalle_fallo: form.detalle_fallo.trim(),
        diagnostico: form.diagnostico.trim(),
        servicio_realizado: form.servicio_realizado.trim(),
        costo: Number(form.costo || 0),
        estado: form.estado,
        garantia_activa: Number(form.garantia_activa),
        fecha_termino: form.fecha_termino || null,
      };
      const confirmed = await confirmAction(
        editingId ? "Actualizar servicio" : "Registrar servicio",
        editingId ? "Deseas guardar los cambios de este servicio?" : "Deseas registrar este nuevo servicio?"
      );

      if (!confirmed) return;

      if (editingId) {
        await actualizarServicio(editingId, payload);
        setMessage("Servicio actualizado correctamente");
        await notifySuccess("Servicio actualizado correctamente");
      } else {
        await crearServicio(payload);
        setMessage("Servicio registrado correctamente");
        await notifySuccess("Servicio registrado correctamente");
      }

      resetForm();
      await cargarDatos();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo guardar el servicio";
      setError(msg);
      await notifyError("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (servicio: Servicio) => {
    setEditingId(servicio.id_servicio);
    setMessage("");
    setError("");
    setForm({
      id_cliente: String(servicio.id_cliente),
      id_vehiculo: String(servicio.id_vehiculo),
      id_cita: servicio.id_cita ? String(servicio.id_cita) : "",
      detalle_fallo: servicio.detalle_fallo ?? "",
      diagnostico: servicio.diagnostico ?? "",
      servicio_realizado: servicio.servicio_realizado ?? "",
      costo: String(servicio.costo ?? 0),
      estado: servicio.estado ?? "pendiente",
      garantia_activa: String(servicio.garantia_activa ?? 1),
      fecha_termino: formatDateTime(servicio.fecha_termino),
    });
  };

  const handleDelete = async (servicio: Servicio) => {
    const confirmar = await confirmDelete(
      "Eliminar servicio",
      `Eliminar servicio #${servicio.id_servicio}? Tambien se eliminaran garantias, remisiones e historial relacionados por cascada.`
    );

    if (!confirmar) return;

    try {
      setError("");
      setMessage("");
      await eliminarServicio(servicio.id_servicio);
      setServicios((current) =>
        current.filter((item) => item.id_servicio !== servicio.id_servicio)
      );
      setMessage("Servicio eliminado correctamente");
      await notifySuccess("Servicio eliminado correctamente");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo eliminar el servicio";
      setError(msg);
      await notifyError("Error", msg);
    }
  };

  return (
    <div className="w-full max-w-550 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Header
        titulo="Servicios"
        subTitulo="Controla diagnostico, reparacion, costo y entrega por vehiculo"
      />

      <div className="bg-white text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm p-6 dark:bg-oscuro-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">
              {editingId ? "Editar Servicio" : "Registrar Nuevo Servicio"}
            </h2>

            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar edicion
              </Button>
            )}
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Cliente" required>
              <select className={selectClassName} value={form.id_cliente} onChange={(event) => updateField("id_cliente", event.target.value)} required>
                <option value="">Selecciona un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id_cliente} value={cliente.id_cliente}>{cliente.nombre}</option>
                ))}
              </select>
            </Field>

            <Field label="Vehiculo" required>
              <select className={selectClassName} value={form.id_vehiculo} onChange={(event) => updateField("id_vehiculo", event.target.value)} required>
                <option value="">Selecciona un vehiculo</option>
                {vehiculosDisponibles.map((vehiculo) => (
                  <option key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo}>
                    {vehiculo.marca} {vehiculo.modelo} {vehiculo.placas ? `- ${vehiculo.placas}` : ""}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Cita relacionada">
              <select className={selectClassName} value={form.id_cita} onChange={(event) => updateField("id_cita", event.target.value)}>
                <option value="">Sin cita</option>
                {citasDisponibles.map((cita) => (
                  <option key={cita.id_cita} value={cita.id_cita}>
                    #{cita.id_cita} - {formatDate(cita.fecha)} {cita.hora?.slice(0, 5)}
                  </option>
                ))}
              </select>
            </Field>

            <div className="space-y-1 sm:col-span-2 lg:col-span-3">
              <label className="text-sm font-medium">Detalle del fallo <span className="text-red-500">*</span></label>
              <textarea
                className="border-input bg-transparent min-h-20 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={form.detalle_fallo}
                onChange={(event) => updateField("detalle_fallo", event.target.value)}
                required
                placeholder="Describe el problema reportado"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium">Diagnostico</label>
              <textarea
                className="border-input bg-transparent min-h-20 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={form.diagnostico}
                onChange={(event) => updateField("diagnostico", event.target.value)}
              />
            </div>

            <Field label="Costo">
              <Input type="number" min="0" step="0.01" value={form.costo} onChange={(event) => updateField("costo", event.target.value)} />
            </Field>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium">Servicio realizado</label>
              <textarea
                className="border-input bg-transparent min-h-20 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={form.servicio_realizado}
                onChange={(event) => updateField("servicio_realizado", event.target.value)}
              />
            </div>

            <Field label="Estado">
              <select className={selectClassName} value={form.estado} onChange={(event) => updateField("estado", event.target.value)}>
                <option value="pendiente">Pendiente</option>
                <option value="diagnostico">Diagnostico</option>
                <option value="reparacion">Reparacion</option>
                <option value="terminado">Terminado</option>
                <option value="entregado">Entregado</option>
              </select>
            </Field>

            <Field label="Garantia">
              <select className={selectClassName} value={form.garantia_activa} onChange={(event) => updateField("garantia_activa", event.target.value)}>
                <option value="1">Activa</option>
                <option value="0">Sin garantia</option>
              </select>
            </Field>

            <Field label="Fecha termino">
              <Input type="datetime-local" value={form.fecha_termino} onChange={(event) => updateField("fecha_termino", event.target.value)} />
            </Field>
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-principal text-white hover:bg-principal-dark" disabled={saving}>
              {saving ? "Guardando..." : editingId ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </div>

      {message && <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}
      {error && <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {loading ? (
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-oscuro-card">Cargando servicios...</div>
      ) : (
        <DataTable
          titulo="Servicios Registrados"
          columns={columns}
          data={servicios}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
    </div>
  );
}
