import { NavLink } from "react-router-dom";
import { Car, X } from "lucide-react";

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

const menuItems = [
  { to: "/citas", icon: "event_note", label: "Citas" },
  { to: "/clientes", icon: "badge", label: "Clientes" },
  { to: "/garantias", icon: "verified", label: "Garantias" },
  { to: "/historial", icon: "history", label: "Historial" },
  { to: "/remisiones", icon: "receipt_long", label: "Remisiones" },
  { to: "/servicios", icon: "build", label: "Servicios" },
  { to: "/usuarios", icon: "group", label: "Usuarios" },
  { to: "/vehiculos", icon: "directions_car", label: "Vehiculos" },
];

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
      <div className="h-24 flex items-center justify-between px-10 border-b border-grisClar dark:bg-oscuro-border">
        <div className="flex items-center gap-3">
          <div className="bg-primario size-10 rounded-lg flex items-center justify-center text-white">
            <Car size={34} className="text-white" />
          </div>

          <div className="flex flex-col leading-none">
            <h1 className="text-white dark:text-white text-lg font-bold uppercase tracking-wider">
              Taller Autos
            </h1>
            <p className="text-slate-300 text-xs font-medium uppercase tracking-widest mt-1 dark:text-gray-400">
              Gestion de taller
            </p>
          </div>
        </div>

        <button
          className="md:hidden text-slate-600 hover:text-primario transition-colors"
          onClick={onClose}
        >
          <X size={24} />
        </button>
      </div>

      <nav className="mt-6 pl-3 space-y-2">
        {menuItems.map((item) => (
          <SidebarLink
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>
    </aside>
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
