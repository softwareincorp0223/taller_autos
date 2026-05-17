import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
  searchableValue?: (row: T) => string;
};

type DataTableProps<T> = {
  titulo: string;
  columns: Column<T>[];
  data: T[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onConvert?: (row: T) => void;
};

export default function DataTable<T>({
  titulo,
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  onConvert,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // 🔍 Filtro
  const filteredData = useMemo(() => {
    if (!search) return data;

    const searchLower = search.toLowerCase();

    return data.filter((row) =>
      columns.some((col) => {
        if (col.searchableValue) {
          return col
            .searchableValue(row)
            .toLowerCase()
            .includes(searchLower);
        }

        if (col.render) return false;

        const value = String((row as any)[col.key] ?? "");
        return value.toLowerCase().includes(searchLower);
      })
    );
  }, [search, data, columns]);

  // 📄 Paginación
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  /* 🔒 Forzar cards en mobile */
  useEffect(() => {
    if (isMobile) setViewMode("cards");
  }, [isMobile]);


  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 dark:bg-oscuro-card space-y-4">
      {/* 🔝 Header */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">{titulo}</h2>

        <Input
          placeholder="Buscar..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm ml-auto"
        />

        {/* 🔁 Toggle SOLO en desktop */}
        {!isMobile && (
          <Button
            variant="outline"
            onClick={() =>
              setViewMode((v) => (v === "table" ? "cards" : "table"))
            }
          >
            <span className="material-icons text-sm mr-1">
              {viewMode === "table" ? "grid_view" : "table_rows"}
            </span>
            {viewMode === "table" ? "Tarjeta" : "Tabla"}
          </Button>
        )}
      </div>

      {/* ================= TABLA ================= */}
      {viewMode === "table" ? (
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.label} className="text-center">
                  {col.label}
                </TableHead>
              ))}
              <TableHead className="text-center">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((row, i) => (
              <TableRow key={i} className="text-center">
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>
                    {col.render
                      ? col.render(row)
                      : (row as any)[col.key]}
                  </TableCell>
                ))}

                <TableCell>
                  <div className="flex justify-center gap-2">
                    {onView && (
                      <Button size="icon" variant="ghost" onClick={() => onView(row)}>
                        <span className="material-icons text-sm">visibility</span>
                      </Button>
                    )}
                    {onEdit && (
                      <Button size="icon" variant="ghost" onClick={() => onEdit(row)}>
                        <span className="material-icons text-sm">edit</span>
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() => onDelete(row)}
                      >
                        <span className="material-icons text-sm">delete</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        /* ================= CARDS ================= */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedData.map((row, i) => (
            <div
              key={i}
              className="relative rounded-xl border bg-white dark:bg-oscuro-card shadow-sm p-5 space-y-4"
            >
              {/* ⋮ Menú acciones */}
              <div className="absolute top-3 right-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <span className="material-icons text-sm">
                        more_vert
                      </span>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    {onView && (
                      <DropdownMenuItem onClick={() => onView(row)}>
                        Ver
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(row)}>
                        Editar
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete(row)}
                      >
                        Eliminar
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* 🧑 Nombre */}
              <div className="text-center pt-2">
                <h3 className="text-lg font-semibold">
                  {(row as any).nombre}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {(row as any).estado}
                </p>
              </div>

              <hr />

              {/* 📋 Datos */}
              <div className="space-y-2 text-sm">
                {columns.map((col) => (
                  <div key={String(col.key)} className="flex justify-between">
                    <span className="text-muted-foreground">{col.label}</span>
                    <span className="font-medium">
                      {col.render
                        ? col.render(row)
                        : (row as any)[col.key]}
                    </span>
                  </div>
                ))}
              </div>

              {/* 🔽 CTA */}
              {onConvert && (
                <Button
                  className="w-full bg-principal hover:bg-principal-dark text-white"
                  onClick={() => onConvert(row)}
                >
                  Convertir a Cliente
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 📄 Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-muted-foreground">
            Página {page} de {totalPages}
          </span>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 768px)");
    setIsMobile(media.matches);

    const listener = () => setIsMobile(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, []);

  return isMobile;
}