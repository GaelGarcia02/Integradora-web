import React, { useState } from "react";
import logo from "../../assets/logo.jpg";

const BotonModal = ({ nombreBoton, icono, contenidoModal, titulo }) => {
  const [show, setShow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleShow = () => {
    setIsExiting(false);
    setShow(true);
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => setShow(false), 250); // mismo tiempo que la animación
  };

  return (
    <>
      {/* --- Botón principal --- */}
      <button
        type="button"
        onClick={handleShow}
        title={titulo || nombreBoton}
        className="flex items-center justify-center gap-2 rounded-md bg-[#0159B3] px-4 py-2 font-semibold text-white shadow-sm transition duration-150 ease-in-out hover:bg-blue-800 cursor-pointer"
      >
        <i className={icono}></i> {nombreBoton}
      </button>

      {/* --- Modal con animaciones --- */}
      {show && (
        <div
          className={`fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 transition-all ${
            isExiting ? "animate-fadeOut" : "animate-fadeIn"
          }`}
          onClick={handleClose}
        >
          <div
            className={`relative z-50 w-full max-w-4xl rounded-xl bg-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
              isExiting ? "animate-scaleDown" : "animate-scaleUp"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* --- Encabezado del modal --- */}
            <div className="flex items-center justify-between border-b p-4 pl-8 bg-[#0159B3] text-white rounded-t-xl">
              <div className="flex items-center">
                <img src={logo} alt="Logo" className="w-14 rounded-lg" />
                <span className="mx-5 h-10 border border-black opacity-25"></span>
                <h3 className="text-lg font-semibold">
                  {titulo || nombreBoton}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 text-white/80 hover:text-white transition"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* --- Contenido --- */}
            <div className="p-6 pt-2 overflow-y-auto flex-1">
              {React.cloneElement(contenidoModal, { onClose: handleClose })}
            </div>

            {/* --- Footer --- */}
            <div className="flex items-center justify-end gap-2 border-t p-4 bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={handleClose}
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
