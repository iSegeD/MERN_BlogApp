import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook ro redirect unauthenticated users.
 * Checks if the user has a valid token in the Redux state.
 * If no token is found, navigates to the login page
 */

const useAuthRedirect = () => {
  const { token, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !token) {
      navigate("/login");
    }
  }, [loading, token, navigate]);
};

export default useAuthRedirect;
