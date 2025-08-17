import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import store from "../store/reduxStore";

import App from "../App";
import Home from "../pages/Home";
import ErrorPage from "../pages/ErrorPage";
import Register from "../pages/Register";
import SignIn from "../pages/SignIn";
import UserProfile from "../pages/UserProfile";
import Authors from "../pages/Authors";
import CreatePost from "../pages/CreatePost";
import TagsPosts from "../pages/TagsPosts";
import AuthorPosts from "../pages/AuthorPosts";
import Dashboard from "../pages/Dashboard";
import EditPost from "../pages/EditPost";
import FullPost from "../pages/FullPost";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <SignIn /> },
      { path: "profile/:id", element: <UserProfile /> },
      { path: "myposts/:id", element: <Dashboard /> },
      { path: "create", element: <CreatePost /> },
      { path: "authors", element: <Authors /> },
      { path: "posts/users/:id", element: <AuthorPosts /> },
      { path: "posts/:id", element: <FullPost /> },
      { path: "posts/:id/edit", element: <EditPost /> },
      { path: "posts/tags/:tag", element: <TagsPosts /> },
    ],
  },
]);

const AppProviders = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
};

export default AppProviders;
