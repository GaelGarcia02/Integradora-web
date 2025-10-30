import React, { useState } from "react";

const BotonModal = ({ nombreBoton, icono, contenidoModal, titulo }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      {/* --- Botón de apertura --- */}
      <button
        type="button"
        onClick={() => setShow(true)}
        title={titulo || nombreBoton}
        className="flex items-center justify-center gap-2 rounded-lg bg-[#0159B3] px-4 py-2 font-semibold text-white shadow-sm hover:bg-[#014b94] transition-all duration-200 ease-in-out"
      >
        {icono && <i className={`${icono} text-sm`}></i>}
        <span>{nombreBoton}</span>
      </button>

      {/* --- Modal --- */}
      {show && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setShow(false)}
        >
          <div
            className="relative z-50 w-full max-w-4xl rounded-xl bg-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* --- Header --- */}
            <div className="flex items-center justify-between border-b p-4 bg-[#0159B3] text-white rounded-t-xl">
              <h3 className="text-lg font-semibold">{titulo || nombreBoton}</h3>
              <button
                type="button"
                onClick={() => setShow(false)}
                className="p-2 text-white/80 hover:text-white transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* --- Contenido (con scroll si es largo) --- */}
            <div className="p-6 overflow-y-auto flex-1">{contenidoModal}</div>

            {/* --- Footer --- */}
            <div className="flex items-center justify-end gap-2 border-t p-4 bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={() => setShow(false)}
                className="rounded-md bg-gray-500 px-4 py-2 font-medium text-white shadow-sm hover:bg-gray-600 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BotonModal;
