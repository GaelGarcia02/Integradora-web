import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/logo.webp";
// import BotonModal from "./Buttons/BotonModal";
// import FormularioPersonalLogin from "./Forms/FormularioPersonalLogin";
// import FormularioRecoverContraseña from "./Forms/FormularioRecoverContraseña";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  console.log(isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      console.log("ye");
      navigate("/tasks");
    }
  }, [isAuthenticated, navigate]);

  // Refs para los campos del formulario
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password_ = passwordRef.current.value;

    try {
      await login(email, password_);
      Swal.fire({
        icon: "success",
        title: "Login exitoso",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Credenciales incorrectas. Intente de nuevo",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm animated-drop">
        <div className="animated-drop text-center mb-6">
          <img src={logo} alt="logo" className="mx-auto h-12 w-auto" />
        </div>

        <strong className="block text-xl font-bold text-center text-gray-800">
          Autenticarse para iniciar sesión
        </strong>

        <hr className="my-6 border-gray-200" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              placeholder="Correo"
              type="email"
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition duration-150"
              id="email"
              ref={emailRef}
            />
          </div>

          <div>
            <input
              placeholder="Contraseña"
              type="password"
              className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         transition duration-150"
              id="password"
              ref={passwordRef}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-m hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition duration-150 cursor-pointer"
            title="Iniciar sesión"
          >
            Acceder
          </button>
        </form>

        {/* También traduje las clases de Bootstrap dentro de los comentarios */}
        {/* <div className="links flex justify-between mt-4">
        //   <BotonModal
        //     icono="fas fa-key"
        //     contenidoModal={<FormularioRecoverContraseña />}
        //     titulo="Recuperar contraseña"
        //   />
        //   <BotonModal
        //     icono="fas fa-user-plus"
        //     contenidoModal={<FormularioPersonalLogin />}
        //     titulo="Registro"
        //   />
        // </div> */}
      </div>
    </div>
  );
}

export default Login;
