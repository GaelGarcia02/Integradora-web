import Swal from "sweetalert2";

export const cerrarSesion = async (logout) => {
  try {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Estás por cerrar sesión",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();
      }
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.message,
    });
  }
};
