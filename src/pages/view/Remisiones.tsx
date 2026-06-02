import { type FormEvent, useEffect, useState } from "react";
import Header from "@/components/Header";
import DataTable, { type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  actualizarRemision,
  crearRemision,
  eliminarRemision,
  obtenerRemisiones,
  type Remision,
} from "@/services/remisionesService";
import { obtenerServicios, type Servicio } from "@/services/serviciosService";
import { confirmAction, confirmDelete, notifyError, notifySuccess } from "@/services/alertService";

type RemisionForm = {
  id_servicio: string;
  folio: string;
  subtotal: string;
  total: string;
  descripcion: string;
  condiciones_garantia: string;
};

const initialForm: RemisionForm = {
  id_servicio: "",
  folio: "",
  subtotal: "0",
  total: "0",
  descripcion: "",
  condiciones_garantia: "",
};

const selectClassName =
  "border-input bg-transparent flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

function servicioLabel(servicio: Servicio) {
  return `#${servicio.id_servicio} - ${servicio.cliente ?? "Cliente"} - ${servicio.marca ?? ""} ${servicio.modelo ?? ""}`;
}

export default function Remisiones() {
  const [remisiones, setRemisiones] = useState<Remision[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [form, setForm] = useState<RemisionForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const cargarDatos = async () => {
    try {
      setError("");
      const [remisionesData, serviciosData] = await Promise.all([
        obtenerRemisiones(),
        obtenerServicios(),
      ]);
      setRemisiones(remisionesData);
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

  const columns: Column<Remision>[] = [
    { key: "folio", label: "Folio" },
    { key: "cliente", label: "Cliente" },
    {
      key: "vehiculo",
      label: "Vehiculo",
      render: (row) => `${row.marca ?? ""} ${row.modelo ?? ""} ${row.placas ? `(${row.placas})` : ""}`,
      searchableValue: (row) => `${row.marca ?? ""} ${row.modelo ?? ""} ${row.placas ?? ""}`,
    },
    { key: "descripcion", label: "Descripcion" },
    { key: "subtotal", label: "Subtotal", render: (row) => `$${Number(row.subtotal ?? 0).toFixed(2)}` },
    { key: "total", label: "Total", render: (row) => `$${Number(row.total ?? 0).toFixed(2)}` },
  ];

  const updateField = (name: keyof RemisionForm, value: string) => {
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
        folio: form.folio.trim(),
        subtotal: Number(form.subtotal || 0),
        total: Number(form.total || 0),
        descripcion: form.descripcion.trim(),
        condiciones_garantia: form.condiciones_garantia.trim(),
      };
      const confirmed = await confirmAction(
        editingId ? "Actualizar remision" : "Registrar remision",
        editingId ? "Deseas guardar los cambios de esta remision?" : "Deseas registrar esta nueva remision?"
      );

      if (!confirmed) return;

      if (editingId) {
        await actualizarRemision(editingId, payload);
        setMessage("Remision actualizada correctamente");
        await notifySuccess("Remision actualizada correctamente");
      } else {
        await crearRemision(payload);
        setMessage("Remision registrada correctamente");
        await notifySuccess("Remision registrada correctamente");
      }

      resetForm();
      await cargarDatos();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo guardar la remision";
      setError(msg);
      await notifyError("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (remision: Remision) => {
    setEditingId(remision.id_remision);
    setMessage("");
    setError("");
    setForm({
      id_servicio: String(remision.id_servicio),
      folio: remision.folio ?? "",
      subtotal: String(remision.subtotal ?? 0),
      total: String(remision.total ?? 0),
      descripcion: remision.descripcion ?? "",
      condiciones_garantia: remision.condiciones_garantia ?? "",
    });
  };

  const handleDelete = async (remision: Remision) => {
    if (!(await confirmDelete("Eliminar remision", `Eliminar remision ${remision.folio ?? `#${remision.id_remision}`}?`))) return;

    try {
      setError("");
      setMessage("");
      await eliminarRemision(remision.id_remision);
      setRemisiones((current) => current.filter((item) => item.id_remision !== remision.id_remision));
      setMessage("Remision eliminada correctamente");
      await notifySuccess("Remision eliminada correctamente");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo eliminar la remision";
      setError(msg);
      await notifyError("Error", msg);
    }
  };

  return (
    <div className="w-full max-w-550 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Header titulo="Remisiones" subTitulo="Folios, totales y condiciones de garantia por servicio" />

      <div className="bg-white text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm p-6 dark:bg-oscuro-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">{editingId ? "Editar Remision" : "Registrar Nueva Remision"}</h2>
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

            <div className="space-y-1">
              <label className="text-sm font-medium">Folio</label>
              <Input value={form.folio} onChange={(event) => updateField("folio", event.target.value)} placeholder="REM-0001" />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Subtotal</label>
              <Input type="number" min="0" step="0.01" value={form.subtotal} onChange={(event) => updateField("subtotal", event.target.value)} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Total</label>
              <Input type="number" min="0" step="0.01" value={form.total} onChange={(event) => updateField("total", event.target.value)} />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium">Descripcion</label>
              <textarea className="border-input bg-transparent min-h-20 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" value={form.descripcion} onChange={(event) => updateField("descripcion", event.target.value)} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Condiciones garantia</label>
              <textarea className="border-input bg-transparent min-h-20 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" value={form.condiciones_garantia} onChange={(event) => updateField("condiciones_garantia", event.target.value)} />
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
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-oscuro-card">Cargando remisiones...</div>
      ) : (
        <DataTable titulo="Remisiones Registradas" columns={columns} data={remisiones} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}
