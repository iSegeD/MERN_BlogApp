// React
import { Link, useNavigate } from "react-router-dom";

// Redux
import { useDispatch } from "react-redux";
import { registration } from "../reducers/authReducer";

// Form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerSchema } from "../validations/authSchema";

// UI & Assets
import { FaUser } from "react-icons/fa6";
import { FaIdBadge } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaKey } from "react-icons/fa";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const handleRegisterSubmit = async (data) => {
    const result = await dispatch(registration(data));

    if (result.success) {
      navigate("/login");
      return;
    }

    if (!result.success && result.message) {
      if (result.message.includes("Username")) {
        setError("username", { type: "server", message: result.message });
      }
      if (result.message.includes("Email")) {
        setError("email", { type: "server", message: result.message });
      }
    }
  };

  return (
    <section className="w-[90%] sm:max-w-2xl mx-auto my-10 lg:my-24 px-4 rounded shadow-lg bg-white/60">
      {/* Create account form */}
      <div className="flex flex-col items-center">
        <h2 className="my-15 text-[#252542] text-3xl font-bold">
          Create account
        </h2>
        <form
          className="w-full max-w-sm"
          onSubmit={handleSubmit(handleRegisterSubmit)}
        >
          <div className="flex items-center gap-3">
            <FaUser />
            <input
              className={`px-3 py-2 w-full rounded border  focus:outline-none focus:ring-2 transition ${
                errors.name?.message
                  ? "focus:ring-red-400 border-red-400"
                  : "focus:ring-blue-400 border-gray-400"
              }`}
              type="text"
              placeholder="Your Full Name"
              {...register("name")}
            />
          </div>
          <p className="ml-7 mt-1 text-sm font-semibold text-red-600">
            {errors.name?.message}
          </p>

          <div className="flex items-center gap-3 mt-5">
            <FaIdBadge />
            <input
              className={`px-3 py-2 w-full rounded border focus:outline-none focus:ring-2 transition ${
                errors.username?.message
                  ? "focus:ring-red-400 border-red-400"
                  : "focus:ring-blue-400 border-gray-400"
              }`}
              type="text"
              placeholder="Your Username"
              {...register("username")}
            />
          </div>
          <p className="ml-7 mt-1 text-sm font-semibold text-red-600">
            {errors.username?.message}
          </p>

          <div className="flex items-center gap-3 mt-5">
            <MdEmail />
            <input
              className={`px-3 py-2 w-full rounded border focus:outline-none focus:ring-2  transition ${
                errors.email?.message
                  ? "focus:ring-red-400 border-red-400"
                  : "focus:ring-blue-400 border-gray-400"
              }`}
              type="text"
              placeholder="Your Email"
              {...register("email")}
            />
          </div>
          <p className="ml-7 mt-1 text-sm font-semibold text-red-600">
            {errors.email?.message}
          </p>

          <div className="flex items-center gap-3 mt-5">
            <FaKey />
            <input
              className={`px-3 py-2 w-full rounded border focus:outline-none focus:ring-2  transition ${
                errors.password?.message
                  ? "focus:ring-red-400 border-red-400"
                  : "focus:ring-blue-400 border-gray-400"
              }`}
              type="password"
              placeholder="Password"
              {...register("password")}
            />
          </div>
          <p className="ml-7 mt-1 text-sm font-semibold text-red-600">
            {errors.password?.message}
          </p>

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
