import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const register = async (userData) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, userData, {
    withCredentials: true,
  });
  return response.data;
};

export const refreshToken = async () => {
  const response = await axios.post(`${BASE_URL}/auth/refresh`, null, {
    withCredentials: true,
  });
  return response.data;
};

export const logOutUser = async () => {
  const response = await axios.post(`${BASE_URL}/auth/logout`, null, {
    withCredentials: true,
  });
  return response.data;
};
