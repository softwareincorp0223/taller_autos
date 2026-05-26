import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import Layout from "@/layouts/Layout";
import Login from "@/pages/auth/Login";
import PrivateRoute from "@/routes/PrivateRoute";
import Citas from "@/pages/view/Citas";
import Clientes from "@/pages/view/Clientes";
import Garantias from "@/pages/view/Garantias";
import Historial from "@/pages/view/Historial";
import Remisiones from "@/pages/view/Remisiones";
import Servicios from "@/pages/view/Servicios";
import Usuarios from "@/pages/view/Usuarios";
import Vehiculos from "@/pages/view/Vehiculos";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Navigate to="/citas" replace />} />
            <Route path="/citas" element={<Citas />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/gariantias" element={<Navigate to="/garantias" replace />} />
            <Route path="/garantias" element={<Garantias />} />
            <Route path="/hitsorial" element={<Navigate to="/historial" replace />} />
            <Route path="/historial" element={<Historial />} />
            <Route path="/remisiones" element={<Remisiones />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/vehiculos" element={<Vehiculos />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/citas" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
