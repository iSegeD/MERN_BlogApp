import { useState } from "react";
import { useDispatch } from "react-redux";
import { signIn } from "../reducers/authReducer";
import { Link, useNavigate } from "react-router-dom";

import NotificationMessage from "../components/NotificationMessage";

import { MdEmail } from "react-icons/md";
import { FaKey } from "react-icons/fa";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(signIn(userData));

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <section className="container max-w-2xl mx-auto my-10 lg:my-24 px-4 rounded shadow-lg bg-white/60">
       {/* Sign In form */}
      <div className="flex flex-col items-center">
        <h2 className="my-10 text-[#252542] text-3xl font-bold">Sign In</h2>
        <form className="w-full max-w-sm" onSubmit={handleLoginSubmit}>
          <NotificationMessage />

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <MdEmail />
              <input
                className="px-3 py-2 w-full rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                type="text"
                placeholder="Your Email"
                name="email"
                value={userData.email}
                onChange={handleInput}
              />
            </div>

            <div className="flex items-center gap-3">
              <FaKey />
              <input
                className="px-3 py-2 w-full rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                type="password"
                placeholder="Password"
                name="password"
                value={userData.password}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-1/2 py-2 rounded text-white uppercase bg-[#376bc0] hover:bg-[#2f5aad] transition-colors duration-300 ease-in-out cursor-pointer"
            >
              login
            </button>
          </div>
        </form>

        <small className="mt-5 mb-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 underline">
            Register
          </Link>
        </small>
      </div>
    </section>
  );
};

export default SignIn;
