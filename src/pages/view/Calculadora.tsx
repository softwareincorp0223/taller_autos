import Header from "@/components/Header";
import Form from "@/components/Form";
import DataTable from "@/components/DataTable";
import productosData from "@/services/personal.json";

export default function Calculadora() {

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
        titulo="Calculadora Financiera"
        subTitulo="Simula proyecciones y escenarios de pensión personalizados"
      />

      {/* FORM CARD */}
      <Form
        title="Registrar"
        fields={formFields}
        columns={3}
        onSubmit={(data) => console.log(data)}
      />

      {/* TABLE CARD */}

      <DataTable
        titulo="Registros"
        columns={columns}
        data={productosData}
        onEdit={(row) => console.log("Editar", row)}
        onDelete={(row) => console.log("Eliminar", row)}
      />
      </div>
  );
}