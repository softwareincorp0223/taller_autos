import Header from "@/components/Header";

type ModulePlaceholderProps = {
  titulo: string;
  subTitulo: string;
  detalle?: string;
};

export default function ModulePlaceholder({
  titulo,
  subTitulo,
  detalle = "Modulo listo en el menu. La funcionalidad se conectara cuando avancemos esta seccion.",
}: ModulePlaceholderProps) {
  return (
    <div className="w-full max-w-550 mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <Header titulo={titulo} subTitulo={subTitulo} />

      <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-oscuro-card">
        <p className="text-sm text-muted-foreground">
          {detalle}
        </p>
      </div>
    </div>
  );
}
