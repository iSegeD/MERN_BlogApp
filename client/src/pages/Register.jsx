import { useState } from "react";
import { useDispatch } from "react-redux";
import { registration } from "../reducers/authReducer";

import { Link, useNavigate } from "react-router-dom";

import { FaUser } from "react-icons/fa6";
import { FaIdBadge } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaKey } from "react-icons/fa";

import NotificationMessage from "../components/NotificationMessage";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleInput = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(registration(userData));

    if (result.success) {
      navigate("/login");
    }
  };

  return (
    <section className="container max-w-2xl mx-auto my-10 lg:my-24 px-4 rounded shadow-lg bg-white/60">
      {/* Create account form */}
      <div className="flex flex-col items-center">
        <h2 className="my-10 text-[#252542] text-3xl font-bold">
          Create account
        </h2>
        <form className="w-full max-w-sm" onSubmit={handleRegisterSubmit}>
          <NotificationMessage />

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <FaUser />
              <input
                className="px-3 py-2 w-full rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                type="text"
                placeholder="Your Full Name"
                name="name"
                value={userData.name}
                onChange={handleInput}
              />
            </div>

            <div className="flex items-center gap-3">
              <FaIdBadge />
              <input
                className="px-3 py-2 w-full rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                type="text"
                placeholder="Your Username"
                name="username"
                value={userData.username}
                onChange={handleInput}
              />
            </div>

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
              className="py-2 px-4 rounded text-white uppercase bg-[#376bc0]  hover:bg-[#2f5aad] transition-colors duration-300 ease-in-out cursor-pointer"
            >
              Create account
            </button>
          </div>
        </form>

        <small className="mt-5 mb-5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline">
            Login here
          </Link>
        </small>
      </div>
    </section>
  );
};

export default Register;
