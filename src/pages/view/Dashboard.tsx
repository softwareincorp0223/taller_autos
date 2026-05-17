import {
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  FileText,
  CreditCard,
  MoreVertical,
} from "lucide-react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Header from "@/components/Header"

export default function Dashboard() {
  return (
    <div className="w-full max-w-550 mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-8">
      {/* Encabezado */}
      <Header
        titulo="Resumen del Dashboard"
        subTitulo="Bienvenido de nuevo. Aquí está el estado más reciente de tu cartera de pensiones."
      />

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon={<UserPlus />}
          title="Nuevos Prospectos"
          value="12"
          percent="5.2%"
          positive
          color="blue"
        />
        <StatCard
          icon={<Users />}
          title="Clientes Activos"
          value="450"
          percent="1.5%"
          positive
          color="purple"
        />
        <StatCard
          icon={<FileText />}
          title="Cotizaciones Mensuales"
          value="85"
          percent="12.4%"
          positive
          color="amber"
        />
        <StatCard
          icon={<CreditCard />}
          title="Pagos Recibidos"
          value="£42,500"
          percent="2.1%"
          positive={false}
          color="emerald"
        />
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Barras */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Rendimiento de Cotizaciones</h3>
              <p className="text-sm text-muted-foreground">
                Estado de los últimos 6 meses
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-bg-principal dark:text-white">
                320 Total
              </p>
              <p className="text-sm font-bold text-green-600">+8% crecimiento</p>
            </div>
          </CardHeader>

          <CardContent>
            <div className="h-64 flex items-end gap-4">
              {[60, 50, 80, 40, 25, 65].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    style={{ height: `${h}%` }}
                    className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-lg hover:bg-bg-principal transition-colors"
                  />
                  <span className="text-xs text-slate-400 font-bold uppercase">
                    {["Ene", "Feb", "Mar", "Abr", "May", "Jun"][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Línea */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Crecimiento de Ingresos</h3>
              <p className="text-sm text-muted-foreground">
                Ingreso acumulado del año
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-bg-principal dark:text-white">
                £145k YTD
              </p>
              <p className="text-sm font-bold text-green-600">+15% vs LY</p>
            </div>
          </CardHeader>

          <CardContent>
            <svg viewBox="0 0 500 200" className="w-full h-64">
              <defs>
                <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1b4250" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1b4250" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 160 Q 50 140, 100 150 T 200 100 T 300 120 T 400 40 T 500 20"
                fill="none"
                stroke="#1b4250"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M0 160 Q 50 140, 100 150 T 200 100 T 300 120 T 400 40 T 500 20 L 500 200 L 0 200 Z"
                fill="url(#area)"
              />
            </svg>
          </CardContent>
        </Card>
      </div>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-xl font-bold">Actividad Reciente de Clientes</h3>
          <Button variant="link" className="font-bold text-bg-principal">
            Ver todo
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Servicio</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última interacción</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {[
                ["Eleanor Wright", "Annuity Review", "Pendiente", "Hoy 10:30"],
                ["Howard Miller", "SIPP Transfer", "Completado", "Ayer"],
                ["Julianne Crawford", "Planificación", "En progreso", "Hace 2 días"],
              ].map((row, i) => (
                <TableRow key={i}>
                  <TableCell className="font-bold">{row[0]}</TableCell>
                  <TableCell>{row[1]}</TableCell>
                  <TableCell>{row[2]}</TableCell>
                  <TableCell>{row[3]}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost">
                      <MoreVertical />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

/* ------------------ */
function StatCard({
  icon,
  title,
  value,
  percent,
  positive,
  color,
}: any) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`size-12 rounded-xl flex items-center justify-center bg-${color}-100 dark:bg-${color}-900/20 text-${color}-600`}
          >
            {icon}
          </div>
          <span
            className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${positive
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
              }`}
          >
            {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {percent}
          </span>
        </div>

        <p className="text-slate-500 dark:text-slate-400 font-medium">
          {title}
        </p>
        <p className="text-3xl font-black mt-1">{value}</p>
      </CardContent>
    </Card>
  )
}
