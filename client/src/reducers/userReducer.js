import { createSlice } from "@reduxjs/toolkit";
import {
  getAllUsers,
  getUser,
  editAvatar,
  editProfile,
} from "../services/userService";
import { setNotification } from "./notificationReducer";

import { toast } from "react-toastify";

const userSlice = createSlice({
  name: "user",
  initialState: {
    all: [],
    single: null,
    loading: {
      all: true,
    },
  },
  reducers: {
    setUsers(state, action) {
      state.all = action.payload;
    },
    addUser(state, action) {
      state.all.push(action.payload);
    },
    editUser(state, action) {
      state.all = state.all.map((item) =>
        item.id !== action.payload.id ? item : action.payload
      );
    },
    editUserAvatar(state, action) {
      state.all = state.all.map((item) =>
        item.id !== action.payload.id ? item : action.payload
      );
    },
    setSingleUser(state, action) {
      state.single = action.payload;
    },
    clearSingleUser(state) {
      state.single = null;
    },
    setLoading(state, action) {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
  },
});

export const {
  setUsers,
  addUser,
  setSingleUser,
  clearSingleUser,
  editUserAvatar,
  editUser,
  setLoading,
} = userSlice.actions;

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await getAllUsers();
    dispatch(setUsers(users));
    dispatch(setLoading({ key: "all", value: false }));
  };
};

export const getUserById = (id) => {
  return async (dispatch) => {
    try {
      const user = await getUser(id);
      dispatch(setSingleUser(user));
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };
};

export const changeUserAvatar = (formData) => {
  return async (dispatch, getState) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const newAvatar = await editAvatar(formData, token);
      dispatch(editUserAvatar(newAvatar));
      toast.success("Profile avatar successfully updated");
      return { success: true };
    } catch (error) {
      dispatch(setNotification(`Error: ${error.response.data.message}`));
      return { success: false };
    }
  };
};

export const patchUser = (userData) => {
  return async (dispatch, getState) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      const updatedUser = await editProfile(userData, token);
      dispatch(editUser(updatedUser));
      toast.success("Profile information successfully updated");
      return { success: true };
    } catch (error) {
      if (
        error.response?.data?.message ===
        "To change password, fill in all password fields"
      ) {
        dispatch(setNotification(`Error: ${error.response.data.message}`));
      }
      return {
        success: false,
        message:
          error.response.data.message ||
          "Something went wrong, please try again",
      };
    }
  };
};

export default userSlice.reducer;
