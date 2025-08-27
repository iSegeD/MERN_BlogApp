// React
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  getUserById,
  clearSingleUser,
  changeUserAvatar,
  patchUser,
} from "../reducers/userReducer";

// Form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { editUserSchema } from "../validations/userSchema";

// Hooks & Components
import useAuthRedirect from "../hooks/useAuthRedirect";
import NotificationMessage from "../components/NotificationMessage";

// UI & Assets
import { MdUploadFile, MdSend, MdOutlineAlternateEmail } from "react-icons/md";
import noAvatar from "../assets/images/noAvatar.png";

const UserProfile = () => {
  useAuthRedirect();

  const { id } = useParams();
  const currentUser = useSelector((state) => state.user.single);
  const dispatch = useDispatch();

  const [avatarFromServer, setAvatarFromServer] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, dirtyFields },
    setError,
  } = useForm({
    resolver: yupResolver(editUserSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      username: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    dispatch(getUserById(id));
    return () => {
      dispatch(clearSingleUser());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name,
        username: currentUser.username,
        email: currentUser.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setAvatarFromServer(currentUser.avatar);
      setNewAvatar(null);
    }
  }, [currentUser, reset]);

  const handleSubmitAvatar = async () => {
    const formData = new FormData();
    formData.append("avatar", newAvatar);

    const result = await dispatch(changeUserAvatar(formData));

    if (result.success) {
      await dispatch(getUserById(id));
      setNewAvatar(null);
    }
    setNewAvatar(null);
  };

  const handleEditSubmit = async (data) => {
    if (!isDirty) {
      return;
    }

    const updatedFields = {};

    Object.keys(dirtyFields).forEach((key) => {
      updatedFields[key] = data[key];
    });

    const result = await dispatch(patchUser(updatedFields));

    if (result.success) {
      dispatch(getUserById(id));
    }

    if (!result.success && result.message) {
      if (result.message.includes("Username")) {
        setError("username", { type: "server", message: result.message });
      }
      if (result.message.includes("Email")) {
        setError("email", { type: "server", message: result.message });
      }

      if (result.message.includes("Invalid")) {
        setError("currentPassword", {
          type: "server",
          message: result.message,
        });
      }
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <section className="container mx-auto my-10 lg:my-24 p-4">
      <div className="max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-7xl mx-auto p-6 rounded shadow-lg bg-white/60">
        {/* UPPER PART: photo + name + post button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-10 mt-10 mb-20">
          {/* Photo */}
          <div className="relative flex-shrink-0 p-2 rounded-full border-4 border-slate-300">
            <img
              src={
                newAvatar
                  ? URL.createObjectURL(newAvatar)
                  : avatarFromServer
                  ? avatarFromServer
                  : noAvatar
              }
              alt={currentUser.name}
              className="w-50 h-50 sm:w-60 sm:h-60 rounded-full object-cover"
            />

            {/* Download icon over avatar */}
            {!newAvatar ? (
              <label
                htmlFor="avatar"
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 p-2 bg-white rounded-full border-1 border-slate-300 cursor-pointer"
              >
                <MdUploadFile className="text-[#252542] text-2xl hover:text-blue-400 transition-colors duration-300 ease-in-out" />
              </label>
            ) : (
              <button
                type="button"
                onClick={handleSubmitAvatar}
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 p-2 bg-white rounded-full border-1 border-slate-300 cursor-pointer"
              >
                <MdSend className="text-[#252542] text-2xl hover:text-blue-400 transition-colors duration-300 ease-in-out" />
              </button>
            )}

            {/* Hidden input file */}
            <input
              type="file"
              name="avatar"
              id="avatar"
              accept="image/jpeg, image/jpg, image/png, image/webp, image/heic, image/heif"
              className="hidden"
              onChange={({ target }) => setNewAvatar(target.files[0])}
            />
          </div>

          {/* Name + post button */}
          <div className="text-center max-w-3xs md:max-w-[50%] space-y-5 ">
            <h3 className="flex flex-wrap items-center justify-center gap-1 text-base md:text-lg lg:text-2xl font-semibold cursor-default">
              <span className="min-w-0 break-words">{currentUser.name}</span>
              <MdOutlineAlternateEmail className="text-2xl text-slate-600 flex-shrink-0" />
              <span className="min-w-0 break-words">
                {currentUser.username}
              </span>
            </h3>

            <Link
              to={`/myposts/${currentUser.id}`}
              className="inline-block py-2 px-4 text-[#252542] font-semibold rounded border border-slate-400 hover:bg-blue-300 transition-all duration-300 ease-in-out"
            >
              View My Posts
            </Link>
          </div>
        </div>

        <h3 className="text-center mb-6 text-2xl text-gray-700 font-semibold after:content-[''] after:block after:w-20 after:h-[2px] after:bg-slate-300 after:mx-auto after:mt-2 select-none">
          Edit Profile
        </h3>

        <NotificationMessage />

        {/* BOTTOM PART: Form */}
        <form className="" onSubmit={handleSubmit(handleEditSubmit)}>
          <input
            className={`px-3 py-2 w-full rounded border  focus:outline-none focus:ring-2 transition ${
              errors.name?.message
                ? "focus:ring-red-400 border-red-300"
                : "focus:ring-blue-400 border-slate-300"
            }`}
            type="text"
            placeholder="Your Full Name"
            {...register("name")}
          />
          <p className="mt-1 ml-1 text-sm font-semibold text-red-600">
            {errors.name?.message}
          </p>

          <input
            className={`mt-5 px-3 py-2 w-full rounded border  focus:outline-none focus:ring-2 transition ${
              errors.username?.message
                ? "focus:ring-red-400 border-red-300"
                : "focus:ring-blue-400 border-gray-300"
            }`}
            type="text"
            placeholder="Your Username"
            {...register("username")}
          />
          <p className="mt-1 ml-1 text-sm font-semibold text-red-600">
            {errors.username?.message}
          </p>

          <input
            className={`mt-5 px-3 py-2 w-full rounded border  focus:outline-none focus:ring-2 transition ${
              errors.email?.message
                ? "focus:ring-red-400 border-red-300"
                : "focus:ring-blue-400 border-gray-300"
            }`}
            type="email"
            placeholder="Your email"
            {...register("email")}
          />
          <p className="mt-1 ml-1 text-sm font-semibold text-red-600">
            {errors.email?.message}
          </p>

          <input
            className={`mt-5 px-3 py-2 w-full rounded border  focus:outline-none focus:ring-2 transition ${
              errors.currentPassword?.message
                ? "focus:ring-red-400 border-red-300"
                : "focus:ring-blue-400 border-gray-300"
            }`}
            type="password"
            placeholder="Current password"
            {...register("currentPassword")}
          />
          <p className="mt-1 ml-1 text-sm font-semibold text-red-600">
            {errors.currentPassword?.message}
          </p>

          <input
            className={`mt-5 px-3 py-2 w-full rounded border  focus:outline-none focus:ring-2 transition ${
              errors.newPassword?.message
                ? "focus:ring-red-400 border-red-300"
                : "focus:ring-blue-400 border-gray-300"
            }`}
            type="password"
            placeholder="New password"
            {...register("newPassword")}
          />
          <p className="mt-1 ml-1 text-sm font-semibold text-red-600">
            {errors.newPassword?.message}
          </p>

          <input
            className={`mt-5 px-3 py-2 w-full rounded border  focus:outline-none focus:ring-2 transition ${
              errors.confirmPassword?.message
                ? "focus:ring-red-400 border-red-300"
                : "focus:ring-blue-400 border-gray-300"
            }`}
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm password"
          />
          <p className="mt-1 ml-1 text-sm font-semibold text-red-600">
            {errors.confirmPassword?.message}
          </p>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className={`py-2 px-4 rounded text-white transition-colors duration-300 ease-in-out ${
                isDirty
                  ? "bg-[#376bc0] hover:bg-[#2f5aad] cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default UserProfile;
