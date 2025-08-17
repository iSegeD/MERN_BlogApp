import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeUser, logOut } from "./reducers/authReducer";

import { Outlet, useNavigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";

import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeUser({ silent: true }));
  }, [dispatch]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const intervalId = setInterval(async () => {
      try {
        await dispatch(initializeUser());
      } catch (error) {
        dispatch(logOut(error));
        navigate("/login");
      }
    }, 14 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [token, dispatch, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnFocusLoss={false}
        pauseOnHover
        theme="light"
      />
      <Header />

      <main className="flex-grow mb-10 lg:mb-24">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default App;
