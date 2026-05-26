import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Form, { type Field } from "@/components/Form";
import DataTable, { type Column } from "@/components/DataTable";
import {
  crearUsuario,
  eliminarUsuario,
  obtenerUsuarios,
  type Usuario,
} from "@/services/usuariosService";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const cargarUsuarios = async () => {
    try {
      setError("");
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const formFields: Field[] = [
    { name: "nombre", label: "Nombre completo", type: "text", required: true },
    { name: "usuario", label: "Usuario", type: "text", required: true },
    { name: "password", label: "Contrasena", type: "password", required: true },
    { name: "rol", label: "Rol", type: "select", options: ["admin", "recepcion"] },
    { name: "activo", label: "Usuario activo", type: "checkbox", defaultChecked: true },
  ];

  const columns: Column<Usuario>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "usuario", label: "Usuario" },
    { key: "rol", label: "Rol" },
    {
      key: "activo",
      label: "Estado",
      render: (row) => row.activo ? "Activo" : "Inactivo",
      searchableValue: (row) => row.activo ? "Activo" : "Inactivo",
    },
  ];

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      setError("");
      setMessage("");

      const nuevoUsuario = await crearUsuario({
        nombre: String(data.nombre),
        usuario: String(data.usuario),
        password: String(data.password),
        rol: String(data.rol || "recepcion"),
        activo: data.activo ? 1 : 0,
      });

      setUsuarios((current) => [nuevoUsuario, ...current]);
      setMessage("Usuario registrado correctamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar el usuario");
      return false;
    }
  };

  const handleDelete = async (usuario: Usuario) => {
    const confirmar = window.confirm(`Eliminar usuario ${usuario.usuario}?`);

    if (!confirmar) return;

    try {
      setError("");
      setMessage("");
      await eliminarUsuario(usuario.id_usuario);
      setUsuarios((current) =>
        current.filter((item) => item.id_usuario !== usuario.id_usuario)
      );
      setMessage("Usuario eliminado correctamente");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el usuario");
    }
  };

  return (
    <div className="w-full max-w-550 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Header
        titulo="Administracion de Usuarios"
        subTitulo="Gestiona asesores, accesos y asignaciones internas"
      />

      <Form
        title="Registrar Nuevo Usuario"
        fields={formFields}
        columns={3}
        onSubmit={handleSubmit}
      />

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
          Cargando usuarios...
        </div>
      ) : (
        <DataTable
          titulo="Usuarios Disponibles"
          columns={columns}
          data={usuarios}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
