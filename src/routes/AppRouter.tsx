import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Layout from "@/layouts/Layout";
import Login from "@/pages/auth/Login";
import Dashboard from "@/pages/view/Dashboard";
import Prospectos from "@/pages/view/Prospectos";
import Sucursales from "@/pages/view/Sucursales";
import Productos from "@/pages/view/Productos";
import Roles from "@/pages/view/Roles";
import Usuarios from "@/pages/view/Usuarios";
import Agenda from "@/pages/view/Agenda";
import Clientes from "@/pages/view/Clientes";
import Cotizaciones from "@/pages/view/Cotizaciones";
import Pagos from "@/pages/view/Pagos";
import Calendario from "@/pages/view/Calendario";
import Documentacion from "@/pages/view/Documentacion";
import Calculadora from "@/pages/view/Calculadora";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
        </Route>

        {/* DASHBOARD */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sucursales" element={<Sucursales />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/prospectos" element={<Prospectos />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/cotizaciones" element={<Cotizaciones />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/documentacion" element={<Documentacion />} />
          <Route path="/calculadora" element={<Calculadora />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
