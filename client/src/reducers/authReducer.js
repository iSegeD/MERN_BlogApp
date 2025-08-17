import { createSlice } from "@reduxjs/toolkit";
import { addUser } from "./userReducer";
import { setNotification } from "./notificationReducer";
import {
  register,
  loginUser,
  refreshToken,
  logOutUser,
} from "../services/authService";

import { toast } from "react-toastify";

const initialState = {
  user: null,
  token: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      const { token, ...user } = action.payload;
      state.user = user;
      state.token = token;
      state.loading = false;
    },
    clearUser(state) {
      state.user = null;
      state.token = null;
      state.loading = false;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export const initializeUser = (options = { silent: false }) => {
  return async (dispatch) => {
    try {
      const user = await refreshToken();
      dispatch(setUser(user));
    } catch (error) {
      dispatch(clearUser());

      if (options.silent && error.response.status === 401) {
        return;
      }

      throw error;
    }
  };
};

export const registration = (credentials) => {
  return async (dispatch) => {
    try {
      const newUser = await register(credentials);
      dispatch(addUser(newUser));
      toast.success("Account created. You can now log in");
      return { success: true };
    } catch (error) {
      dispatch(setNotification(`Error: ${error.response.data.message}`));
      return {
        success: false,
      };
    }
  };
};

export const signIn = (credentials) => {
  return async (dispatch) => {
    try {
      const user = await loginUser(credentials);

      dispatch(setUser(user));
      toast.success("👋 Welcome back!");
      return { success: true };
    } catch (error) {
      dispatch(setNotification(`Error: ${error.response.data.message}`));
      return { success: false };
    }
  };
};

export const logOut = (error) => {
  return async (dispatch) => {
    try {
      await logOutUser();
      dispatch(clearUser());
      if (error) {
        toast.info("Your session has expired, please log in again", {
          autoClose: 5000,
        });
      } else {
        toast.success("You have been logged out");
      }
    } catch (error) {
      dispatch(clearUser());
      toast.info("Logged out for security reasons");
    }
  };
};

export default authSlice.reducer;
