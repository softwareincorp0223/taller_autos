import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import DataTable, { type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  actualizarCita,
  crearCita,
  eliminarCita,
  obtenerCitas,
  type Cita,
} from "@/services/citasService";
import { obtenerClientes, type Cliente } from "@/services/clientesService";
import { obtenerVehiculos, type Vehiculo } from "@/services/vehiculosService";
import { confirmAction, confirmDelete, notifyError, notifySuccess } from "@/services/alertService";

type CitaForm = {
  id_cliente: string;
  id_vehiculo: string;
  fecha: string;
  hora: string;
  tipo_ingreso: string;
  estado: string;
  observaciones: string;
};

const initialForm: CitaForm = {
  id_cliente: "",
  id_vehiculo: "",
  fecha: "",
  hora: "",
  tipo_ingreso: "cita",
  estado: "pendiente",
  observaciones: "",
};

const selectClassName =
  "border-input bg-transparent flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

const estadoLabels: Record<string, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  en_proceso: "En proceso",
  terminada: "Terminada",
  cancelada: "Cancelada",
};

function formatDate(value: string) {
  if (!value) return "";
  return value.includes("T") ? value.split("T")[0] : value.slice(0, 10);
}

function formatTime(value: string) {
  if (!value) return "";
  return value.slice(0, 5);
}

export default function Citas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [form, setForm] = useState<CitaForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const vehiculosDisponibles = useMemo(() => {
    if (!form.id_cliente) return vehiculos;
    return vehiculos.filter((vehiculo) =>
      String(vehiculo.id_cliente) === form.id_cliente
    );
  }, [form.id_cliente, vehiculos]);

  const cargarDatos = async () => {
    try {
      setError("");
      const [citasData, clientesData, vehiculosData] = await Promise.all([
        obtenerCitas(),
        obtenerClientes(),
        obtenerVehiculos(),
      ]);

      setCitas(citasData);
      setClientes(clientesData);
      setVehiculos(vehiculosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const columns: Column<Cita>[] = [
    { key: "fecha", label: "Fecha", render: (row) => formatDate(row.fecha) },
    { key: "hora", label: "Hora", render: (row) => formatTime(row.hora) },
    { key: "cliente", label: "Cliente" },
    {
      key: "vehiculo",
      label: "Vehiculo",
      render: (row) => `${row.marca ?? ""} ${row.modelo ?? ""} ${row.placas ? `(${row.placas})` : ""}`,
      searchableValue: (row) => `${row.marca ?? ""} ${row.modelo ?? ""} ${row.placas ?? ""}`,
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => estadoLabels[row.estado] ?? row.estado,
      searchableValue: (row) => estadoLabels[row.estado] ?? row.estado,
    },
  ];

  const updateField = (name: keyof CitaForm, value: string) => {
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "id_cliente" ? { id_vehiculo: "" } : {}),
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        id_cliente: Number(form.id_cliente),
        id_vehiculo: Number(form.id_vehiculo),
        fecha: form.fecha,
        hora: form.hora,
        tipo_ingreso: form.tipo_ingreso,
        estado: form.estado,
        observaciones: form.observaciones,
      };
      const confirmed = await confirmAction(
        editingId ? "Actualizar cita" : "Registrar cita",
        editingId ? "Deseas guardar los cambios de esta cita?" : "Deseas registrar esta nueva cita?"
      );

      if (!confirmed) return;

      if (editingId) {
        await actualizarCita(editingId, payload);
        setMessage("Cita actualizada correctamente");
        await notifySuccess("Cita actualizada correctamente");
      } else {
        await crearCita(payload);
        setMessage("Cita registrada correctamente");
        await notifySuccess("Cita registrada correctamente");
      }

      resetForm();
      await cargarDatos();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo guardar la cita";
      setError(msg);
      await notifyError("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cita: Cita) => {
    setEditingId(cita.id_cita);
    setMessage("");
    setError("");
    setForm({
      id_cliente: String(cita.id_cliente),
      id_vehiculo: String(cita.id_vehiculo),
      fecha: formatDate(cita.fecha),
      hora: formatTime(cita.hora),
      tipo_ingreso: cita.tipo_ingreso,
      estado: cita.estado,
      observaciones: cita.observaciones ?? "",
    });
  };

  const handleDelete = async (cita: Cita) => {
    const confirmar = await confirmDelete(
      "Eliminar cita",
      `Eliminar la cita de ${cita.cliente ?? "cliente"}?`
    );

    if (!confirmar) return;

    try {
      setError("");
      setMessage("");
      await eliminarCita(cita.id_cita);
      setCitas((current) => current.filter((item) => item.id_cita !== cita.id_cita));
      setMessage("Cita eliminada correctamente");
      await notifySuccess("Cita eliminada correctamente");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo eliminar la cita";
      setError(msg);
      await notifyError("Error", msg);
    }
  };

  return (
    <div className="w-full max-w-550 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Header
        titulo="Citas"
        subTitulo="Agenda ingresos, confirma visitas y relaciona clientes con vehiculos"
      />

      <div className="bg-white text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm p-6 dark:bg-oscuro-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">
              {editingId ? "Editar Cita" : "Registrar Nueva Cita"}
            </h2>

            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar edicion
              </Button>
            )}
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Cliente" required>
              <select
                className={selectClassName}
                value={form.id_cliente}
                onChange={(event) => updateField("id_cliente", event.target.value)}
                required
              >
                <option value="">Selecciona un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Vehiculo" required>
              <select
                className={selectClassName}
                value={form.id_vehiculo}
                onChange={(event) => updateField("id_vehiculo", event.target.value)}
                required
              >
                <option value="">Selecciona un vehiculo</option>
                {vehiculosDisponibles.map((vehiculo) => (
                  <option key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo}>
                    {vehiculo.marca} {vehiculo.modelo} {vehiculo.placas ? `- ${vehiculo.placas}` : ""}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Fecha" required>
              <Input
                type="date"
                value={form.fecha}
                onChange={(event) => updateField("fecha", event.target.value)}
                required
              />
            </Field>

            <Field label="Hora" required>
              <Input
                type="time"
                value={form.hora}
                onChange={(event) => updateField("hora", event.target.value)}
                required
              />
            </Field>

            <Field label="Tipo de ingreso">
              <select
                className={selectClassName}
                value={form.tipo_ingreso}
                onChange={(event) => updateField("tipo_ingreso", event.target.value)}
              >
                <option value="cita">Cita</option>
                <option value="sin_cita">Sin cita</option>
              </select>
            </Field>

            <Field label="Estado">
              <select
                className={selectClassName}
                value={form.estado}
                onChange={(event) => updateField("estado", event.target.value)}
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="en_proceso">En proceso</option>
                <option value="terminada">Terminada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </Field>

            <div className="space-y-1 sm:col-span-2 lg:col-span-3">
              <label className="text-sm font-medium">
                Observaciones
              </label>
              <textarea
                className="border-input bg-transparent min-h-24 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={form.observaciones}
                onChange={(event) => updateField("observaciones", event.target.value)}
                placeholder="Notas del ingreso, sintomas o comentarios del cliente"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-principal text-white hover:bg-principal-dark"
              disabled={saving}
            >
              {saving ? "Guardando..." : editingId ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </form>
      </div>

      {message && (
        <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </p>
      )}

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-oscuro-card">
          Cargando citas...
        </div>
      ) : (
        <DataTable
          titulo="Citas Registradas"
          columns={columns}
          data={citas}
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
