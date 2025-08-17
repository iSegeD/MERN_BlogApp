import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserById,
  clearSingleUser,
  changeUserAvatar,
  patchUser,
} from "../reducers/userReducer";

import { Link, useParams } from "react-router-dom";

import useAuthRedirect from "../hooks/useAuthRedirect";

import NotificationMessage from "../components/NotificationMessage";

import { MdUploadFile, MdSend, MdOutlineAlternateEmail } from "react-icons/md";

import noAvatar from "../assets/images/noAvatar.png";

const UserProfile = () => {
  useAuthRedirect();
  const { id } = useParams();
  const currentUser = useSelector((state) => state.user.single);
  const dispatch = useDispatch();

  const [avatarFromServer, setAvatarFromServer] = useState("");
  const [newAvatar, setNewAvatar] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    dispatch(getUserById(id));
    return () => {
      dispatch(clearSingleUser());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setUsername(currentUser.username);
      setEmail(currentUser.email);
      setAvatarFromServer(currentUser.avatar);
      setNewAvatar(null);
    }
  }, [currentUser]);

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

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const isNameChange = name !== currentUser.name;
    const isUsernameChange = username !== currentUser.username;
    const isEmailChange = email !== currentUser.email;
    const isPasswordChange =
      currentPassword !== "" || newPassword !== "" || confirmPassword !== "";

    if (
      !isNameChange &&
      !isUsernameChange &&
      !isEmailChange &&
      !isPasswordChange
    ) {
      return;
    }

    const userData = {};

    if (isNameChange) userData.name = name;
    if (isUsernameChange) userData.username = username;
    if (isEmailChange) userData.email = email;

    if (isPasswordChange) {
      if (currentPassword) userData.currentPassword = currentPassword;
      if (newPassword) userData.newPassword = newPassword;
      if (confirmPassword) userData.confirmPassword = confirmPassword;
    }

    const result = await dispatch(patchUser(userData));

    if (result.success) {
      dispatch(getUserById(id));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
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
              accept="image/png, image/jpg, image/jpeg"
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
        <form className="space-y-4" onSubmit={handleEditSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Your Full Name"
            value={name}
            onChange={({ target }) => setName(target.value)}
            className="px-3 py-2 w-full rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <input
            type="text"
            name="username"
            placeholder="Your Username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            className="px-3 py-2 w-full rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Your email"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            className="px-3 py-2 w-full rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <input
            type="password"
            name="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={({ target }) => setCurrentPassword(target.value)}
            className="px-3 py-2 w-full rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <input
            type="password"
            name="password"
            placeholder="New password"
            value={newPassword}
            onChange={({ target }) => setNewPassword(target.value)}
            className="px-3 py-2 w-full rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={({ target }) => setConfirmPassword(target.value)}
            placeholder="Confirm password"
            className="px-3 py-2 w-full rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="py-2 px-4 rounded text-white bg-[#376bc0] hover:bg-[#2f5aad] transition-colors duration-300 ease-in-out cursor-pointer"
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
