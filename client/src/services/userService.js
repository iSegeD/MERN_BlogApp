import axios from "axios";
import { axiosConfig } from "../config/axiosConfig";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllUsers = async () => {
  const response = await axios.get(`${BASE_URL}/users`);
  return response.data;
};

export const getUser = async (userID) => {
  const response = await axios.get(`${BASE_URL}/users/${userID}`);
  return response.data;
};

export const editAvatar = async (formData, token) => {
  const response = await axios.post(
    `${BASE_URL}/users/change-avatar`,
    formData,
    axiosConfig(token)
  );
  return response.data;
};

export const editProfile = async (data, token) => {
  const response = await axios.patch(
    `${BASE_URL}/users/edit-user`,
    data,
    axiosConfig(token)
  );
  return response.data;
};
