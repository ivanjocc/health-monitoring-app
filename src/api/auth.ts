import axios from 'axios';

const BASE_URL = "http://localhost:5001/api/users";

// Registro de usuarios
export const registerUser = async (userData: any) => {
  try {
    const response = await axios.post(BASE_URL, userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Error during registration";
  }
};

// Inicio de sesión
export const loginUser = async (loginData: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, loginData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || "Error during login";
  }
};
