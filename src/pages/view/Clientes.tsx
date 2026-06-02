import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import Header from "@/components/Header";
import DataTable, { type Column } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  actualizarCliente,
  crearCliente,
  eliminarCliente,
  obtenerClientes,
  type Cliente,
} from "@/services/clientesService";
import { confirmAction, confirmDelete, notifyError, notifySuccess } from "@/services/alertService";

type ClienteForm = {
  nombre: string;
  telefono: string;
  correo: string;
  direccion: string;
  activo: string;
};

const initialForm: ClienteForm = {
  nombre: "",
  telefono: "",
  correo: "",
  direccion: "",
  activo: "1",
};

const selectClassName =
  "border-input bg-transparent flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [form, setForm] = useState<ClienteForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const cargarClientes = async () => {
    try {
      setError("");
      const data = await obtenerClientes();
      setClientes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const columns: Column<Cliente>[] = [
    { key: "nombre", label: "Cliente" },
    { key: "telefono", label: "Telefono" },
    { key: "correo", label: "Correo" },
    {
      key: "total_vehiculos",
      label: "Vehiculos",
      render: (row) => row.total_vehiculos ?? 0,
      searchableValue: (row) => String(row.total_vehiculos ?? 0),
    },
    {
      key: "total_citas",
      label: "Citas",
      render: (row) => row.total_citas ?? 0,
      searchableValue: (row) => String(row.total_citas ?? 0),
    },
    {
      key: "activo",
      label: "Estado",
      render: (row) => row.activo ? "Activo" : "Inactivo",
      searchableValue: (row) => row.activo ? "Activo" : "Inactivo",
    },
  ];

  const updateField = (name: keyof ClienteForm, value: string) => {
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
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        correo: form.correo.trim(),
        direccion: form.direccion.trim(),
        activo: Number(form.activo),
      };
      const confirmed = await confirmAction(
        editingId ? "Actualizar cliente" : "Registrar cliente",
        editingId ? "Deseas guardar los cambios de este cliente?" : "Deseas registrar este nuevo cliente?"
      );

      if (!confirmed) return;

      if (editingId) {
        await actualizarCliente(editingId, payload);
        setMessage("Cliente actualizado correctamente");
        await notifySuccess("Cliente actualizado correctamente");
      } else {
        await crearCliente(payload);
        setMessage("Cliente registrado correctamente");
        await notifySuccess("Cliente registrado correctamente");
      }

      resetForm();
      await cargarClientes();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo guardar el cliente";
      setError(msg);
      await notifyError("Error", msg);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingId(cliente.id_cliente);
    setMessage("");
    setError("");
    setForm({
      nombre: cliente.nombre ?? "",
      telefono: cliente.telefono ?? "",
      correo: cliente.correo ?? "",
      direccion: cliente.direccion ?? "",
      activo: String(cliente.activo ?? 1),
    });
  };

  const handleDelete = async (cliente: Cliente) => {
    const relacionados =
      Number(cliente.total_vehiculos ?? 0) +
      Number(cliente.total_citas ?? 0) +
      Number(cliente.total_servicios ?? 0);
    const extra = relacionados > 0
      ? " Tambien se eliminaran registros relacionados por las llaves foraneas."
      : "";
    const confirmar = await confirmDelete("Eliminar cliente", `Eliminar cliente ${cliente.nombre}?${extra}`);

    if (!confirmar) return;

    try {
      setError("");
      setMessage("");
      await eliminarCliente(cliente.id_cliente);
      setClientes((current) =>
        current.filter((item) => item.id_cliente !== cliente.id_cliente)
      );
      setMessage("Cliente eliminado correctamente");
      await notifySuccess("Cliente eliminado correctamente");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo eliminar el cliente";
      setError(msg);
      await notifyError("Error", msg);
    }
  };

  return (
    <div className="w-full max-w-550 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Header
        titulo="Clientes"
        subTitulo="Administra datos de contacto y relaciones con vehiculos, citas y servicios"
      />

      <div className="bg-white text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm p-6 dark:bg-oscuro-card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">
              {editingId ? "Editar Cliente" : "Registrar Nuevo Cliente"}
            </h2>

            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancelar edicion
              </Button>
            )}
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Nombre" required>
              <Input
                value={form.nombre}
                onChange={(event) => updateField("nombre", event.target.value)}
                required
                placeholder="Nombre completo"
              />
            </Field>

            <Field label="Telefono">
              <Input
                value={form.telefono}
                onChange={(event) => updateField("telefono", event.target.value)}
                placeholder="7220000000"
              />
            </Field>

            <Field label="Correo">
              <Input
                type="email"
                value={form.correo}
                onChange={(event) => updateField("correo", event.target.value)}
                placeholder="cliente@correo.com"
              />
            </Field>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-medium">
                Direccion
              </label>
              <textarea
                className="border-input bg-transparent min-h-20 w-full rounded-md border px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                value={form.direccion}
                onChange={(event) => updateField("direccion", event.target.value)}
                placeholder="Direccion del cliente"
              />
            </div>

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
          Cargando clientes...
        </div>
      ) : (
        <DataTable
          titulo="Clientes Registrados"
          columns={columns}
          data={clientes}
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
