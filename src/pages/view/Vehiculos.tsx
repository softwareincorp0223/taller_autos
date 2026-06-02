import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import Header from "@/components/Header";
import DataTable, { type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { obtenerClientes, type Cliente } from "@/services/clientesService";
import {
  actualizarVehiculo,
  crearVehiculo,
  eliminarVehiculo,
  obtenerVehiculos,
  type Vehiculo,
} from "@/services/vehiculosService";
import { confirmAction, confirmDelete, notifyError, notifySuccess } from "@/services/alertService";

type VehiculoForm = {
  id_cliente: string;
  marca: string;
  modelo: string;
  anio: string;
  color: string;
  placas: string;
  numero_serie: string;
  activo: string;
};

const initialForm: VehiculoForm = {
  id_cliente: "",
  marca: "",
  modelo: "",
  anio: "",
  color: "",
  placas: "",
  numero_serie: "",
  activo: "1",
};

const selectClassName =
  "border-input bg-transparent flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

export default function Vehiculos() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState<VehiculoForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const cargarDatos = async () => {
    try {
      setError("");
      const [vehiculosData, clientesData] = await Promise.all([
        obtenerVehiculos(),
        obtenerClientes(),
      ]);

      setVehiculos(vehiculosData);
      setClientes(clientesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const columns: Column<Vehiculo>[] = [
    { key: "cliente", label: "Cliente" },
    { key: "marca", label: "Marca" },
    { key: "modelo", label: "Modelo" },
    { key: "anio", label: "Anio" },
    { key: "placas", label: "Placas" },
    {
      key: "activo",
      label: "Estado",
      render: (row) => row.activo ? "Activo" : "Inactivo",
      searchableValue: (row) => row.activo ? "Activo" : "Inactivo",
    },
  ];

  const updateField = (name: keyof VehiculoForm, value: string) => {
    setForm((current) => ({
      ...current,
      [name]: value,
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
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),
        anio: form.anio ? Number(form.anio) : null,
        color: form.color.trim(),
        placas: form.placas.trim(),
        numero_serie: form.numero_serie.trim(),
        activo: Number(form.activo),
      };
      const confirmed = await confirmAction(
        editingId ? "Actualizar vehiculo" : "Registrar vehiculo",
        editingId ? "Deseas guardar los cambios de este vehiculo?" : "Deseas registrar este nuevo vehiculo?"
      );

      if (!confirmed) return;

      if (editingId) {
        await actualizarVehiculo(editingId, payload);
        setMessage("Vehiculo actualizado correctamente");
        await notifySuccess("Vehiculo actualizado correctamente");
      } else {
        await crearVehiculo(payload);
        setMessage("Vehiculo registrado correctamente");
        await notifySuccess("Vehiculo registrado correctamente");
      }

      resetForm();
      await cargarDatos();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo guardar el vehiculo";
      setError(msg);
      await notifyError("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (vehiculo: Vehiculo) => {
    setEditingId(vehiculo.id_vehiculo);
    setMessage("");
    setError("");
    setForm({
      id_cliente: String(vehiculo.id_cliente),
      marca: vehiculo.marca ?? "",
      modelo: vehiculo.modelo ?? "",
      anio: vehiculo.anio ? String(vehiculo.anio) : "",
      color: vehiculo.color ?? "",
      placas: vehiculo.placas ?? "",
      numero_serie: vehiculo.numero_serie ?? "",
      activo: String(vehiculo.activo ?? 1),
    });
  };

  const handleDelete = async (vehiculo: Vehiculo) => {
    const confirmar = await confirmDelete(
      "Eliminar vehiculo",
      `Eliminar vehiculo ${vehiculo.marca} ${vehiculo.modelo}? Tambien se eliminaran citas/servicios relacionados por cascada.`
    );

    if (!confirmar) return;

    try {
      setError("");
      setMessage("");
      await eliminarVehiculo(vehiculo.id_vehiculo);
      setVehiculos((current) =>
        current.filter((item) => item.id_vehiculo !== vehiculo.id_vehiculo)
      );
      setMessage("Vehiculo eliminado correctamente");
      await notifySuccess("Vehiculo eliminado correctamente");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo eliminar el vehiculo";
      setError(msg);
      await notifyError("Error", msg);
    }
  };

  return (
    <div className="w-full max-w-550 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Header
        titulo="Vehiculos"
        subTitulo="Registra unidades y mantenlas ligadas a sus clientes"
      />

      <div className="bg-white text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm p-6 dark:bg-oscuro-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">
              {editingId ? "Editar Vehiculo" : "Registrar Nuevo Vehiculo"}
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

            <Field label="Marca" required>
              <Input value={form.marca} onChange={(event) => updateField("marca", event.target.value)} required />
            </Field>

            <Field label="Modelo" required>
              <Input value={form.modelo} onChange={(event) => updateField("modelo", event.target.value)} required />
            </Field>

            <Field label="Anio">
              <Input type="number" value={form.anio} onChange={(event) => updateField("anio", event.target.value)} />
            </Field>

            <Field label="Color">
              <Input value={form.color} onChange={(event) => updateField("color", event.target.value)} />
            </Field>

            <Field label="Placas">
              <Input value={form.placas} onChange={(event) => updateField("placas", event.target.value)} />
            </Field>

            <Field label="Numero de serie">
              <Input value={form.numero_serie} onChange={(event) => updateField("numero_serie", event.target.value)} />
            </Field>

            <Field label="Estado">
              <select
                className={selectClassName}
                value={form.activo}
                onChange={(event) => updateField("activo", event.target.value)}
              >
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select>
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
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-oscuro-card">Cargando vehiculos...</div>
      ) : (
        <DataTable
          titulo="Vehiculos Registrados"
          columns={columns}
          data={vehiculos}
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
