import { NavLink } from "react-router-dom";
import { Wallet, X } from "lucide-react"

const linkBase = `
  relative
  flex items-center justify-between
  w-full
  px-7 py-4 mb-2
  transition-all duration-300
  rounded-l-full
`;

const linkActive = "bg-grisClaro text-principal shadow-xl dark:bg-oscuro dark:text-white";
const linkInactive = "text-grisClaro hover:bg-grisClaro/10";

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <aside
      className={`
        fixed top-0 left-0 z-50 h-screen w-75
        bg-principal
        dark:bg-oscuro-border
        text-principal dark:text-white
        rounded-r-lg
        transform transition-transform duration-300
        overflow-y-auto
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* LOGO */}

      <div className="h-24 flex items-center justify-between px-10 border-b border-grisClar dark:bg-oscuro-border">
        {/* LOGO + TEXTO */}
        <div className="flex items-center gap-3">
          <div className="bg-primario size-10 rounded-lg flex items-center justify-center text-white">
            {/* Icono */}
            <Wallet size={48} className="text-white" />
          </div>

          <div className="flex flex-col leading-none">
            <h1 className="text-white dark:text-white text-lg font-bold uppercase tracking-wider">
              Pension CRM
            </h1>
            <p className="text-slate-300 text-xs font-medium uppercase tracking-widest mt-1 dark:text-gray-400">
              Portal de asesores
            </p>
          </div>
        </div>

        {/* BOTÓN CERRAR MOBILE */}
        <button
          className="md:hidden text-slate-600 hover:text-primario transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </div>


      <nav className="mt-6 pl-3 space-y-2">
        <SidebarLink to="/dashboard" icon="dashboard" label="Dashboard" />
        <SidebarLink to="/sucursales" icon="corporate_fare" label="Sucursales" />
        <SidebarLink to="/productos" icon="inventory_2" label="Productos" />
        <SidebarLink to="/roles" icon="admin_panel_settings" label="Roles" />
        <SidebarLink to="/usuarios" icon="group" label="Usuarios" />
        <SidebarLink to="/prospectos" icon="person_search" label="Prospectos" />
        <SidebarLink to="/agenda" icon="event_note" label="Agenda" />
        <SidebarLink to="/clientes" icon="badge" label="Clientes" />
        <SidebarLink to="/cotizaciones" icon="request_quote" label="Cotización" />
        <SidebarLink to="/pagos" icon="payments" label="Pagos" />
        <SidebarLink to="/calendario" icon="calendar_month" label="Calendario" />
        <SidebarLink to="/documentacion" icon="folder_open" label="Documentación" />
        <SidebarLink to="/calculadora" icon="calculate" label="Calculadora" />
      </nav>
    </aside>
  );
}

/* ---------- COMPONENTES AUX ---------- */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="px-6 mb-2 text-xs uppercase tracking-widest text-primario dark:text-white">
        {title}
      </p>
      {children}
    </div>
  );
}

function SidebarLink({
  to,
  icon,
  label,
}: {
  to: string;
  icon: string;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? linkActive : linkInactive}`
      }
    >
      <div className="flex items-center gap-3">
        <span className="material-icons text-lg">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>

      <span className="material-icons text-sm opacity-70">
        chevron_right
      </span>
    </NavLink>
  );
}
