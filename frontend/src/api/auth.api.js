import axios from "axios";

const route = "http://127.0.0.1:4000/api";

export const loginRequest = async (userData) => {
  try {
    const response = await axios.post(`${route}/login`, userData, {
      withCredentials: true,
    });
    console.log("Datos enviados:", userData);
    return response;
  } catch (error) {
    console.error("Error en la solicitud de login:", error);
    throw error;
  }
};

export const logoutRequest = () => axios.post(`${route}/logout`);
