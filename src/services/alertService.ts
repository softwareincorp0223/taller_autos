import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const brandColor = "#2563eb";
const dangerColor = "#dc2626";

export async function showDemoNotice() {
  const key = "taller_autos_demo_notice";

  if (sessionStorage.getItem(key)) return;

  sessionStorage.setItem(key, "shown");

  await Swal.fire({
    title: "Version demo",
    text: "Esta version permite hasta 20 registros por tabla. Para agregar mas registros sera necesario contratar la version full.",
    icon: "info",
    confirmButtonText: "Entendido",
    confirmButtonColor: brandColor,
  });
}

export async function confirmAction(title: string, text: string) {
  const result = await Swal.fire({
    title,
    text,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Si, continuar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: brandColor,
    cancelButtonColor: "#64748b",
  });

  return result.isConfirmed;
}

export async function confirmDelete(title: string, text: string) {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Si, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: dangerColor,
    cancelButtonColor: "#64748b",
  });

  return result.isConfirmed;
}

export function notifySuccess(title: string, text?: string) {
  return Swal.fire({
    title,
    text,
    icon: "success",
    timer: 1800,
    showConfirmButton: false,
  });
}

export function notifyError(title: string, text?: string) {
  return Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonText: "Entendido",
    confirmButtonColor: dangerColor,
  });
}
