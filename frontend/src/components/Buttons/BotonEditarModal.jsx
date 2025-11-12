import React, { useState } from "react";
import logo from "../../assets/logo.jpg";

const BotonEditarModal = ({ nombreBoton, icono, contenidoModal, titulo }) => {
  const [show, setShow] = useState(false);

  return (
    <>
      {/* --- Botón de apertura --- */}
      <button
        type="button"
        onClick={() => setShow(true)}
        title={titulo || nombreBoton}
        className="flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-gray-800 shadow-sm hover:bg-yellow-500 transition-all duration-200 ease-in-out cursor-pointer"
      >
        <i className={icono}></i> {nombreBoton}
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
            <div className="flex items-center justify-between border-b p-4 pl-8 bg-[#0159B3] text-white rounded-t-xl">
              <div className="flex items-center">
                <img src={logo} alt="" className="w-15 rounded-lg" />
                <span className="mx-5 h-10 bg-black border opacity-25"></span>
                <h3 className="text-lg font-semibold items-center flex">
                  {titulo || nombreBoton}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShow(false)}
                className="p-2 text-gray-700/80 hover:text-gray-800 transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* --- Contenido (con scroll si es largo) --- */}
            <div className="p-6 pt-2 overflow-y-auto flex-1">
              {contenidoModal()}
            </div>

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

export default BotonEditarModal;
