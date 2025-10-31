import React from "react";
// ⛔️ import { Button } from "react-bootstrap"; // Ya no se necesita
import { useNavigate } from "react-router-dom";

const BotonUrl = ({ nombreBoton, icono, url }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(url);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex items-center justify-center gap-2 rounded-md bg-[#0159B3] px-4 py-2 font-semibold text-white shadow-sm transition duration-150 ease-in-out hover:bg-blue-800"
    >
      <i className={icono}></i> {nombreBoton}
    </button>
  );
};

export default BotonUrl;
