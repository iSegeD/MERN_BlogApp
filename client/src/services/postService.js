import axios from "axios";
import { axiosConfig } from "../config/axiosConfig";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllPosts = async () => {
  const response = await axios.get(`${BASE_URL}/posts`);
  return response.data;
};

export const getPost = async (postId) => {
  const response = await axios.get(`${BASE_URL}/posts/${postId}`);
  return response.data;
};

export const getPostForEdit = async (postId) => {
  const response = await axios.get(`${BASE_URL}/posts/${postId}/edit`);
  return response.data;
};

export const getTagPosts = async (tag) => {
  const response = await axios.get(`${BASE_URL}/posts/tags/${tag}`);
  return response.data;
};

export const getUserPosts = async (userId) => {
  const response = await axios.get(`${BASE_URL}/posts/users/${userId}`);
  return response.data;
};

export const create = async (formData, token) => {
  const response = await axios.post(
    `${BASE_URL}/posts`,
    formData,
    axiosConfig(token)
  );
  return response.data;
};

export const edit = async (formData, postId, token) => {
  const response = await axios.patch(
    `${BASE_URL}/posts/${postId}`,
    formData,
    axiosConfig(token)
  );
  return response.data;
};

export const newComment = async (comment, postId, token) => {
  const response = await axios.patch(
    `${BASE_URL}/posts/${postId}/comments`,
    comment,
    axiosConfig(token)
  );
  return response.data;
};

export const removeComment = async (postId, commentId, token) => {
  const response = await axios.delete(
    `${BASE_URL}/posts/${postId}/comments/${commentId}`,
    axiosConfig(token)
  );

  return response.data;
};

export const remove = async (postId, token) => {
  const response = await axios.delete(
    `${BASE_URL}/posts/${postId}`,
    axiosConfig(token)
  );
  return response.data;
};
