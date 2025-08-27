// React
import { Link, useNavigate } from "react-router-dom";

// Redux
import { useDispatch } from "react-redux";
import { signIn } from "../reducers/authReducer";

// Form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../validations/authSchema";

// UI & Assets
import { MdEmail } from "react-icons/md";
import { FaKey } from "react-icons/fa";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const handleLoginSubmit = async (data) => {
    const result = await dispatch(signIn(data));

    if (result.success) {
      navigate("/");
      return;
    }

    if (!result.success && result.message) {
      setError("email", { type: "server", message: result.message });
      setError("password", { type: "server", message: result.message });
    }
  };

  return (
    <section className="w-[90%] sm:max-w-2xl mx-auto my-10 lg:my-24 px-4 rounded shadow-lg bg-white/60">
      {/* Sign In form */}
      <div className="flex flex-col items-center">
        <h2 className="my-15 text-[#252542] text-3xl font-bold">Sign In</h2>
        <form
          className="w-full max-w-sm"
          onSubmit={handleSubmit(handleLoginSubmit)}
        >
          <div className="flex items-center gap-3">
            <MdEmail />
            <input
              className={`px-3 py-2 w-full rounded border  focus:outline-none focus:ring-2 transition ${
                errors.email?.message
                  ? "focus:ring-red-400 border-red-400"
                  : "focus:ring-blue-400 border-gray-400"
              }`}
              type="text"
              placeholder="Your Email"
              {...register("email")}
              onFocus={() => {
                if (errors.email?.type === "server") {
                  clearErrors("email");
                }
              }}
            />
          </div>
          <p className="ml-7 mt-1 text-sm font-semibold text-red-600">
            {errors.email?.message}
          </p>

          <div className="flex items-center gap-3 mt-5">
            <FaKey />
            <input
              className={`px-3 py-2 w-full rounded border  focus:outline-none focus:ring-2 transition ${
                errors.password?.message
                  ? "focus:ring-red-400 border-red-400"
                  : "focus:ring-blue-400 border-gray-400"
              }`}
              type="password"
              placeholder="Password"
              {...register("password")}
              onFocus={() => {
                if (errors.password?.type === "server") {
                  clearErrors("password");
                }
              }}
            />
          </div>
          <p className="ml-7 mt-1 text-sm font-semibold text-red-600">
            {errors.password?.message}
          </p>

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
