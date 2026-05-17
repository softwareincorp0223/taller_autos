import Header from "@/components/Header";
import Form from "@/components/Form";
import DataTable from "@/components/DataTable";
import productosData from "@/services/personal.json";
import { Package, PackageX, Percent } from "lucide-react";


export default function Productos() {

  const formFields = [
    { name: "nombre", label: "Nombre del Producto", type: "text", required: true },
    { name: "tipo", label: "Tipo", type: "select", options: ["Plan", "Servicio", "Paquete"] },
    { name: "precio", label: "Precio Base", type: "number" },
    { name: "comision", label: "Comisión (%)", type: "number" },
    { name: "estado", label: "Estado", type: "select", options: ["Activo", "Inactivo"] },
    { name: "descripcion", label: "Descripción", type: "textarea", columns: 3 },
  ];

  const columns = [
    { key: "nombre", label: "Producto" },
    { key: "tipo", label: "Tipo" },
    { key: "precio", label: "Precio" },
    { key: "comision", label: "Comisión (%)" },
    { key: "estado", label: "Estado" },
  ];

  return (

    <div className="w-full max-w-550 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

      <Header
        titulo="Catálogo de Productos"
        subTitulo="Gestiona planes, comisiones y configuración comercial"
      />

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Productos Activos"
          value="24"
          icon={Package}
          color="bg-emerald-100 text-emerald-600"
        />

        <StatCard
          title="Productos Inactivos"
          value="5"
          icon={PackageX}
          color="bg-red-100 text-red-600"
        />

        <StatCard
          title="Comisión Promedio"
          value="12%"
          icon={Percent}
          color="bg-blue-100 text-blue-600"
        />

      </div>

      {/* FORM CARD */}
      <Form
        title="Registrar Nuevo Producto"
        fields={formFields}
        columns={3}
        onSubmit={(data) => console.log(data)}
      />

      {/* TABLE CARD */}

      <DataTable
        titulo="Productos Disponibles"
        columns={columns}
        data={productosData}
        onEdit={(row) => console.log("Editar", row)}
        onDelete={(row) => console.log("Eliminar", row)}
      />

    </div>

  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-oscuro-card rounded-2xl shadow-sm border p-6 flex items-center justify-between">

      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <h3 className="text-2xl font-bold mt-2 text-principal dark:text-white">
          {value}
        </h3>
      </div>

      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={22} />
      </div>

    </div>
  );
}