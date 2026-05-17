import { Button } from "@/components/ui/button";
type Props = {
  row: any;
  onBack: () => void;
};

export function DetalleProspecto({ row, onBack }: Props) {
  return (
    <div className="bg-white dark:bg-oscuro-card rounded-xl border shadow-sm p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Detalle del Prospecto</h2>

        <Button variant="outline" onClick={onBack}>
          ← Volver
        </Button>
      </div>
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        <div className="max-w-6xl mx-auto px-8 py-8">

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-[#6a7b81] mb-6">
            <a className="hover:text-primary" href="#">Clients</a>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-[#121516] dark:text-white font-medium">
              {row.asesor}
            </span>
          </nav>

          {/* Profile Header */}
          <div className="bg-white dark:bg-oscuro  rounded-xl p-6 shadow-sm border  mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex gap-6 items-center">
                <div
                  className="bg-center bg-cover rounded-full size-24 border-4 border-background-light  shadow-md"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCo3JXzr4-Tfp_HoKROYtnjk4gCYtcZ5KqCzS7kUi57SR9aR3_YLozHlnenwohroDxxQQB26gSU_gha54TIDPq_lnV8oiskSJ6L8RfFLMMHtNCn2pol5hvB9Mqc65YDaE_Zjga5gUQhkzHcGHCPc-IIf5019dKQG7BdbcyBx8rNv7ySwQ7khLpkIiGSHyj18Priv1fqcxRXlSW3MvWq6ZEnRIYPpXMfd6BJv8nYZ6KnurWcP81k5SdHsEA8eUQmu0RUdY4OrvKmaaOH")',
                  }}
                />
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-[#121516] dark:text-white">
                      {row.nombre}
                    </h2>
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold px-2 py-0.5  uppercase border rounded-2xl">
                      Activo
                    </span>
                  </div>
                  <p className="text-[#6a7b81] text-sm mt-1">
                    ID: #992834 • Cliente desde 2015
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="material-symbols-outlined">
                        mail
                      </span>
                      r.sterling@email.com
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="material-symbols-outlined text-base text-[#6a7b81]">
                        call
                      </span>
                      {row.telefono}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 w-full md:w-auto">
                
                <button className="flex-1 md:flex-none bg-principal hover:bg-principal-dark text-white rounded-lg h-10 px-6 text-sm font-bold shadow-sm">
                  Convertir a Cliente
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b   mb-6 px-2 overflow-x-auto">
            <div className="flex gap-8 whitespace-nowrap">
              {["Información General", "Cuotas", "Pagos", "Documentos", "Historial"].map(
                (tab, i) => (
                  <a
                    key={tab}
                    href="#"
                    className={`pb-3 pt-2 text-sm tracking-wide ${i === 0
                      ? "border-b-2 border-primary text-primary font-bold"
                      : "border-b-2 border-transparent text-[#6a7b81] hover:text-primary"
                      }`}
                  >
                    {tab}
                  </a>
                )
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card */}
            <InfoCard title="Información Personal" icon="person" />

            {/* Right Card */}
            <InfoCard title="Retirement Portfolio" icon="analytics" />
          </div>

          {/* Summary */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard primary />
            <SummaryCard />
            <SummaryCard />
          </div>
        </div>
      </main>

    </div>
  );
}

function InfoCard({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="bg-white dark:bg-oscuro rounded-xl shadow-sm border  ">
      <div className="px-6 py-4 border-b flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">{icon}</span>
        <h3 className="font-bold">{title}</h3>
      </div>
      <div className="p-6 text-sm text-muted-foreground">
        Content goes here…
      </div>
    </div>
  );
}

function SummaryCard({ primary }: { primary?: boolean }) {
  return (
    <div
      className={`rounded-xl p-5 shadow-sm ${primary
          ? "bg-principal text-white"
          : "bg-white dark:bg-oscuro border"
        }`}
    >
      <p className="text-xs uppercase tracking-wider opacity-70">
        Example Metric
      </p>
      <p className="text-2xl font-bold mt-1">$4,850</p>
    </div>
  );
}