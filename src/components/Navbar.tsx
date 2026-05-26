import { useLocation, useNavigate } from "react-router-dom";
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
import { logout } from "@/services/authService";

const routeTitles: Record<string, string> = {
  "/citas": "Citas",
  "/clientes": "Clientes",
  "/garantias": "Garantias",
  "/historial": "Historial",
  "/remisiones": "Remisiones",
  "/servicios": "Servicios",
  "/usuarios": "Usuarios",
  "/vehiculos": "Vehiculos",
};

export default function Navbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = routeTitles[pathname] ?? "Sistema Integral";

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="
      h-14
      bg-grisClaro dark:bg-oscuro
      flex items-center justify-between
      px-6 md:px-8 md:ml-72
    ">
      <div className="flex items-center gap-3">
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

      <div className="flex items-center gap-4">
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

        <div className="flex items-center">
          <ThemeToggle />
        </div>

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
                <AvatarFallback>TA</AvatarFallback>
              </Avatar>

              <span className="
                text-sm
                font-medium
                hidden sm:block
                leading-none
              ">
                Taller
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              <span className="material-icons text-sm mr-2">
                logout
              </span>
              Cerrar sesion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
