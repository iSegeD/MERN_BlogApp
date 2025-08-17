import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    setInfo(state, action) {
      return action.payload;
    },
    hideInfo(state, action) {
      return "";
    },
  },
});

export const { setInfo, hideInfo } = notificationSlice.actions;

let timeoutId = null;

export const setNotification = (message) => {
  return async (dispatch) => {
    dispatch(setInfo(message));

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      dispatch(hideInfo());
      timeoutId = null;
    }, 6000);
  };
};

export default notificationSlice.reducer;
