import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/authReducer";
import userReducer from "../reducers/userReducer";
import postReducer from "../reducers/postReducer";
import notificationReducer from "../reducers/notificationReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    post: postReducer,
    notification: notificationReducer,
  },
});

export default store;
