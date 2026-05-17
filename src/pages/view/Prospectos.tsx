import { useState } from "react";
import Header from "@/components/Header";
import Form from "@/components/Form";
import DataTable from "@/components/DataTable";
import type { Column } from "@/components/DataTable";
import personalData from "@/services/personal.json";
import { DetalleProspecto } from "../details/DetalleProspecto";

export default function Prospectos() {

  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");

  const formFields = [
    {
      name: "nombre_prospecto",
      label: "Nombre",
      type: "text",
      required: true,
    },
    {
      name: "apellidos_prospecto",
      label: "Apellidos",
      type: "text",
      required: true,
    },
    {
      name: "telefono_prospecto",
      label: "Teléfono",
      type: "number",
      required: true,
    },
    {
      name: "fuente",
      label: "Fuente",
      type: "text",
      required: true,
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: ["Activo", "Pendiente", "Progreso"],
      required: true,
    },
    {
      name: "asesor",
      label: "Asesor",
      type: "select",
      options: ["Empleado 1", "Empleado 2", "Empleado 3"],
      required: true,
    },
  ];

  type Prospectos = {
    id: number;
    nombre: string;
    apellido?: string;
    telefono: string;
    fuente: string;
    estado: string;
    asesor: string;
  };

  const columns: Column<Prospectos>[] = [
    {
      key: "nombre",
      label: "Prospecto",
      searchableValue: (p) => `${p.nombre} ${p.apellido ?? ""}`,
      render: (p) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm text-foreground">
            {p.nombre} {p.apellido}
          </span>
          <span className="text-xs text-muted-foreground">
            ID #{p.id}
          </span>
        </div>
      ),
    },
    {
      key: "telefono",
      label: "Teléfono",
      render: (p) => (
        <span className="text-sm font-mono text-foreground">
          {p.telefono}
        </span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      searchableValue: (p) => p.estado,
      render: (p) => (
        <span
          className={`
            inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
            ${p.estado === "Activo"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
              : p.estado === "Pendiente"
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            }
          `}
        >
          {p.estado}
        </span>
      ),
    },
    {
      key: "asesor",
      label: "Asesor",
      searchableValue: (p) => p.asesor,
      render: (p) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
            {p.asesor
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")}
          </div>
          <span className="text-sm">{p.asesor}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-550 mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8">
      <Header
        titulo="Lista de Prospectos"
        subTitulo="Gestionar y rastrear sus clientes potenciales."
      />

      {/* CONTENIDO */}
      <div className="relative">
        {/* LISTA */}
        <div
          className={`transition-all duration-300 ease-in-out ${viewMode === "list"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none hidden"
            }`}
        >
          <div className="flex flex-col gap-4">
            <Form
              title="Datos del Prospecto"
              fields={formFields}
              columns={3}
              onSubmit={(data) => console.log(data)}
            />

            <DataTable
              titulo="Prospectos Registrados"
              columns={columns}
              data={personalData}
              onConvert={(row) => console.log("Cliente", row)}
              onView={(row) => {
                setSelectedRow(row);
                setViewMode("detail");
              }}
              onEdit={(row) => console.log("Editar", row)}
              onDelete={(row) => console.log("Eliminar", row)}
            />
          </div>
        </div>

        {/* DETALLE */}
        <div
          className={`transition-all duration-300 ease-in-out ${viewMode === "detail"
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none hidden"
            }`}
        >
          {selectedRow && (
            <DetalleProspecto
              row={selectedRow}
              onBack={() => {
                setViewMode("list");
                setSelectedRow(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
