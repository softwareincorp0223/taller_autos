
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Checkbox } from "@/components/ui/checkbox";

/* =========================
   TIPOS
========================= */

type FieldType = "text" | "email" | "password" | "select" | "file" | "checkbox" | (string & {}) | "number" | "textarea";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  colSpan?: number;
  defaultChecked?: boolean;
};

type FormValues = Record<string, any>;

type FormProps = {
  title?: string;
  fields: Field[];
  columns?: 1 | 2 | 3 | 4;
  onSubmit: (values: FormValues) => void | boolean | Promise<void | boolean>;
};

/* =========================
   MAPAS TAILWIND
========================= */

const gridColsMap = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

const colSpanMap = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
};

/* =========================
   COMPONENTE
========================= */

export default function Form({
  title,
  fields,
  columns = 2,
  onSubmit,
}: FormProps) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const shouldReset = await onSubmit(Object.fromEntries(data.entries()));

    if (shouldReset !== false) {
      e.currentTarget.reset();
    }
  };

  const renderField = (field: Field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
        return (
          <Input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case "textarea":
        return (
          <Input
            type="text"
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
          />
        );

      case "file":
        return <Input type="file" name={field.name} />;

      case "select":
        return (
          <Select name={field.name}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "checkbox":
        return (
          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              name={field.name}
              value="1"
              defaultChecked={field.defaultChecked}
            />
            <span className="text-sm text-muted-foreground">
              {field.label}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm p-6 dark:bg-oscuro-card">
      <form onSubmit={handleSubmit} className="space-y-6">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}

      <div
        className={`grid gap-4 grid-cols-1 sm:grid-cols-2 ${gridColsMap[columns]}`}
      >
        {fields.map((field) => (
          <div
            key={field.name}
            className={`space-y-1 ${field.colSpan ? colSpanMap[field.colSpan as 1 | 2 | 3 | 4] : ""
              }`}
          >
            {field.type !== "checkbox" && (
              <label className="text-sm font-medium">
                {field.label}
                {field.required && (
                  <span className="text-red-500"> *</span>
                )}
              </label>
            )}

            {renderField(field)}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-2 pt-4 ">
        <Button
          type="submit"
          className="bg-principal text-white hover:bg-principal-dark"
        >
          Guardar
        </Button>
      </div>
    </form>
    </div>
  );
}
