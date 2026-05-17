import { useLocation } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import ThemeToggle from "./ThemeToggle";

const routeTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/sucursales": "Sucursales",
  "/productos": "Productos",
  "/roles": "Roles",
  "/usuarios": "Usuarios",
  "/prospectos": "Prospectos",
  "/agenda": "Agenda",
  "/clientes": "Clientes",
  "/cotizaciones": "Cotizaciones",
  "/pagos": "Pagos",
  "/calendario": "Calendario",
  "/documentacion": "Documentación",
  "/calculadora": "Calculadora",
};

export default function Navbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { pathname } = useLocation();

  const title =
    routeTitles[pathname] ?? "Sistema Integral";

  return (
    <header className="
      h-14
      bg-grisClaro dark:bg-oscuro
      flex items-center justify-between
      px-6 md:px-8 md:ml-72
    ">
      {/* IZQUIERDA */}
      <div className="flex items-center gap-3">
        {/* BOTÓN HAMBURGUESA */}
        <button
          className="md:hidden flex items-center justify-center"
          onClick={onMenuClick}
        >
          <span className="material-icons text-primario">
            menu
          </span>
        </button>

        <h1 className="font-bold text-2xl leading-none">
          {title}
        </h1>
      </div>

      {/* DERECHA */}
      <div className="flex items-center gap-4">
        {/* NOTIFICACIONES */}
        <button className="
          relative
          flex items-center justify-center
          hover:text-primario
          transition
        ">
          <span className="material-icons">
            notifications
          </span>
          <span className="
            absolute -top-1 -right-1
            w-2 h-2
            bg-red-500
            rounded-full
          " />
        </button>

        {/* CONFIG */}
        <button className="
          hidden sm:flex
          flex items-center justify-center
          dark:hover:text-gray-500
          hover:text-principal
          transition
          hover:rotate-90
          duration-300
        ">
          <span className="material-icons">
            settings
          </span>
        </button>

        {/* THEME TOGGLE */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>

        {/* USUARIO */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="
              flex items-center gap-2
              hover:bg-black/5
              px-2 py-1
              rounded-lg
            ">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/assets/react.svg" />
                <AvatarFallback>AE</AvatarFallback>
              </Avatar>

              <span className="
                text-sm
                font-medium
                hidden sm:block
                leading-none
              ">
                Angel
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={() => console.log("Cerrar sesión")}
            >
              <span className="material-icons text-sm mr-2">
                logout
              </span>
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
