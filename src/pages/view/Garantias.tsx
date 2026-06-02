import { type FormEvent, useEffect, useState } from "react";
import Header from "@/components/Header";
import DataTable, { type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  actualizarGarantia,
  crearGarantia,
  eliminarGarantia,
  obtenerGarantias,
  type Garantia,
} from "@/services/garantiasService";
import { obtenerServicios, type Servicio } from "@/services/serviciosService";
import { confirmAction, confirmDelete, notifyError, notifySuccess } from "@/services/alertService";

type GarantiaForm = {
  id_servicio: string;
  detalle_garantia: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
};

const initialForm: GarantiaForm = {
  id_servicio: "",
  detalle_garantia: "",
  fecha_inicio: "",
  fecha_fin: "",
  estado: "activa",
};

const selectClassName =
  "border-input bg-transparent flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

const estadoLabels: Record<string, string> = {
  activa: "Activa",
  vencida: "Vencida",
  cancelada: "Cancelada",
};

function formatDate(value?: string) {
  if (!value) return "";
  return value.includes("T") ? value.split("T")[0] : value.slice(0, 10);
}

function servicioLabel(servicio: Servicio) {
  return `#${servicio.id_servicio} - ${servicio.cliente ?? "Cliente"} - ${servicio.marca ?? ""} ${servicio.modelo ?? ""}`;
}

export default function Garantias() {
  const [garantias, setGarantias] = useState<Garantia[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [form, setForm] = useState<GarantiaForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const cargarDatos = async () => {
    try {
      setError("");
      const [garantiasData, serviciosData] = await Promise.all([
        obtenerGarantias(),
        obtenerServicios(),
      ]);
      setGarantias(garantiasData);
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

  const columns: Column<Garantia>[] = [
    { key: "cliente", label: "Cliente" },
    {
      key: "vehiculo",
      label: "Vehiculo",
      render: (row) => `${row.marca ?? ""} ${row.modelo ?? ""} ${row.placas ? `(${row.placas})` : ""}`,
      searchableValue: (row) => `${row.marca ?? ""} ${row.modelo ?? ""} ${row.placas ?? ""}`,
    },
    { key: "detalle_garantia", label: "Detalle" },
    { key: "fecha_inicio", label: "Inicio", render: (row) => formatDate(row.fecha_inicio) },
    { key: "fecha_fin", label: "Fin", render: (row) => formatDate(row.fecha_fin) },
    {
      key: "estado",
      label: "Estado",
      render: (row) => estadoLabels[row.estado] ?? row.estado,
      searchableValue: (row) => estadoLabels[row.estado] ?? row.estado,
    },
  ];

  const updateField = (name: keyof GarantiaForm, value: string) => {
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
        detalle_garantia: form.detalle_garantia.trim(),
        fecha_inicio: form.fecha_inicio,
        fecha_fin: form.fecha_fin,
        estado: form.estado,
      };
      const confirmed = await confirmAction(
        editingId ? "Actualizar garantia" : "Registrar garantia",
        editingId ? "Deseas guardar los cambios de esta garantia?" : "Deseas registrar esta nueva garantia?"
      );

      if (!confirmed) return;

      if (editingId) {
        await actualizarGarantia(editingId, payload);
        setMessage("Garantia actualizada correctamente");
        await notifySuccess("Garantia actualizada correctamente");
      } else {
        await crearGarantia(payload);
        setMessage("Garantia registrada correctamente");
        await notifySuccess("Garantia registrada correctamente");
      }

      resetForm();
      await cargarDatos();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo guardar la garantia";
      setError(msg);
      await notifyError("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (garantia: Garantia) => {
    setEditingId(garantia.id_garantia);
    setMessage("");
    setError("");
    setForm({
      id_servicio: String(garantia.id_servicio),
      detalle_garantia: garantia.detalle_garantia ?? "",
      fecha_inicio: formatDate(garantia.fecha_inicio),
      fecha_fin: formatDate(garantia.fecha_fin),
      estado: garantia.estado ?? "activa",
    });
  };

  const handleDelete = async (garantia: Garantia) => {
    if (!(await confirmDelete("Eliminar garantia", "Eliminar garantia?"))) return;

    try {
      setError("");
      setMessage("");
      await eliminarGarantia(garantia.id_garantia);
      setGarantias((current) => current.filter((item) => item.id_garantia !== garantia.id_garantia));
      setMessage("Garantia eliminada correctamente");
      await notifySuccess("Garantia eliminada correctamente");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo eliminar la garantia";
      setError(msg);
      await notifyError("Error", msg);
    }
  };

  return (
    <div className="w-full max-w-550 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Header titulo="Garantias" subTitulo="Control de garantias asociadas a servicios realizados" />

      <div className="bg-white text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm p-6 dark:bg-oscuro-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{editingId ? "Editar Garantia" : "Registrar Nueva Garantia"}</h2>
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
              <label className="text-sm font-medium">Detalle <span className="text-red-500">*</span></label>
              <textarea className="border-input bg-transparent min-h-20 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" value={form.detalle_garantia} onChange={(event) => updateField("detalle_garantia", event.target.value)} required />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Fecha inicio <span className="text-red-500">*</span></label>
              <input className={selectClassName} type="date" value={form.fecha_inicio} onChange={(event) => updateField("fecha_inicio", event.target.value)} required />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Fecha fin <span className="text-red-500">*</span></label>
              <input className={selectClassName} type="date" value={form.fecha_fin} onChange={(event) => updateField("fecha_fin", event.target.value)} required />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Estado</label>
              <select className={selectClassName} value={form.estado} onChange={(event) => updateField("estado", event.target.value)}>
                <option value="activa">Activa</option>
                <option value="vencida">Vencida</option>
                <option value="cancelada">Cancelada</option>
              </select>
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
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-oscuro-card">Cargando garantias...</div>
      ) : (
        <DataTable titulo="Garantias Registradas" columns={columns} data={garantias} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
