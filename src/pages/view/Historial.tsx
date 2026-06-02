import { type FormEvent, useEffect, useState } from "react";
import Header from "@/components/Header";
import DataTable, { type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  actualizarHistorial,
  crearHistorial,
  eliminarHistorial,
  obtenerHistorial,
  type HistorialItem,
} from "@/services/historialService";
import { obtenerServicios, type Servicio } from "@/services/serviciosService";
import { confirmAction, confirmDelete, notifyError, notifySuccess } from "@/services/alertService";

type HistorialForm = {
  id_servicio: string;
  descripcion: string;
};

const initialForm: HistorialForm = {
  id_servicio: "",
  descripcion: "",
};

const selectClassName =
  "border-input bg-transparent flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

function formatDateTime(value?: string) {
  if (!value) return "";
  return value.replace("T", " ").slice(0, 16);
}

function servicioLabel(servicio: Servicio) {
  return `#${servicio.id_servicio} - ${servicio.cliente ?? "Cliente"} - ${servicio.marca ?? ""} ${servicio.modelo ?? ""}`;
}

export default function Historial() {
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [form, setForm] = useState<HistorialForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const cargarDatos = async () => {
    try {
      setError("");
      const [historialData, serviciosData] = await Promise.all([
        obtenerHistorial(),
        obtenerServicios(),
      ]);
      setHistorial(historialData);
      setServicios(serviciosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const columns: Column<HistorialItem>[] = [
    { key: "fecha", label: "Fecha", render: (row) => formatDateTime(row.fecha) },
    { key: "cliente", label: "Cliente" },
    {
      key: "vehiculo",
      label: "Vehiculo",
      render: (row) => `${row.marca ?? ""} ${row.modelo ?? ""} ${row.placas ? `(${row.placas})` : ""}`,
      searchableValue: (row) => `${row.marca ?? ""} ${row.modelo ?? ""} ${row.placas ?? ""}`,
    },
    { key: "detalle_fallo", label: "Servicio" },
    { key: "descripcion", label: "Descripcion" },
  ];

  const updateField = (name: keyof HistorialForm, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
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
        id_servicio: Number(form.id_servicio),
        descripcion: form.descripcion.trim(),
      };
      const confirmed = await confirmAction(
        editingId ? "Actualizar historial" : "Registrar historial",
        editingId ? "Deseas guardar los cambios de este historial?" : "Deseas registrar este nuevo historial?"
      );

      if (!confirmed) return;

      if (editingId) {
        await actualizarHistorial(editingId, payload);
        setMessage("Historial actualizado correctamente");
        await notifySuccess("Historial actualizado correctamente");
      } else {
        await crearHistorial(payload);
        setMessage("Historial registrado correctamente");
        await notifySuccess("Historial registrado correctamente");
      }

      resetForm();
      await cargarDatos();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo guardar el historial";
      setError(msg);
      await notifyError("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: HistorialItem) => {
    setEditingId(item.id_historial);
    setMessage("");
    setError("");
    setForm({
      id_servicio: String(item.id_servicio),
      descripcion: item.descripcion ?? "",
    });
  };

  const handleDelete = async (item: HistorialItem) => {
    if (!(await confirmDelete("Eliminar historial", "Eliminar registro de historial?"))) return;

    try {
      setError("");
      setMessage("");
      await eliminarHistorial(item.id_historial);
      setHistorial((current) => current.filter((row) => row.id_historial !== item.id_historial));
      setMessage("Historial eliminado correctamente");
      await notifySuccess("Historial eliminado correctamente");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo eliminar el historial";
      setError(msg);
      await notifyError("Error", msg);
    }
  };

  return (
    <div className="w-full max-w-550 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Header titulo="Historial" subTitulo="Consulta y registra eventos historicos de servicios" />

      <div className="bg-white text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm p-6 dark:bg-oscuro-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{editingId ? "Editar Historial" : "Registrar Historial"}</h2>
            {editingId && <Button type="button" variant="outline" onClick={resetForm}>Cancelar edicion</Button>}
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1 lg:col-span-3">
              <label className="text-sm font-medium">Servicio <span className="text-red-500">*</span></label>
              <select className={selectClassName} value={form.id_servicio} onChange={(event) => updateField("id_servicio", event.target.value)} required>
                <option value="">Selecciona un servicio</option>
                {servicios.map((servicio) => (
                  <option key={servicio.id_servicio} value={servicio.id_servicio}>{servicioLabel(servicio)}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1 sm:col-span-2 lg:col-span-3">
              <label className="text-sm font-medium">Descripcion</label>
              <textarea className="border-input bg-transparent min-h-20 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" value={form.descripcion} onChange={(event) => updateField("descripcion", event.target.value)} />
            </div>
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
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-oscuro-card">Cargando historial...</div>
      ) : (
        <DataTable titulo="Historial de Servicios" columns={columns} data={historial} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
