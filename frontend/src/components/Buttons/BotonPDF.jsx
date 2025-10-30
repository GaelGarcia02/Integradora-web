import React from "react";
import { jsPDF } from "jspdf";
import Swal from "sweetalert2";

const BotonPDF = ({ pageTitle, columns, data }) => {
  const handleClick = () => {
    const doc = new jsPDF();
    doc.save(`${pageTitle}.pdf`);

    Swal.fire({
      icon: "success",
      title: "PDF generado",
      text: "El PDF se ha generado correctamente",
      confirmButtonColor: "#0159B3",
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title="Generar PDF"
      className="flex items-center justify-center gap-2 rounded-lg bg-gray-500 px-4 py-2 font-semibold text-white shadow-sm hover:bg-gray-600 transition-all duration-200 ease-in-out"
    >
      <i className="fas fa-file-pdf text-sm"></i>
      <span className="hidden sm:inline">Exportar PDF</span>
    </button>
  );
};

export default BotonPDF;
