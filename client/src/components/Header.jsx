import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../reducers/authReducer";

import { Link, useNavigate } from "react-router-dom";

import { BiMenu } from "react-icons/bi";
import { CiLogin } from "react-icons/ci";

const Header = () => {
  const currentUser = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Header */}
      <nav className="relative flex justify-between items-center h-20 py-6 px-8 md:px-32 bg-[#f8f8ff] shadow-md">
        <Link
          className="gradient-text animate-gradient text-2xl font-extrabold uppercase hover:scale-105 transition-transform duration-300 ease-in-out select-none"
          to="/"
          onClick={() => setIsMenuOpen(false)}
        >
          Inkflow
        </Link>

        {/* Desktop menu */}
        <ul className="hidden xl:flex">
          {currentUser.token && (
            <Link
              className="text-[#252542] font-semibold p-3 hover:text-blue-400 transition-colors duration-300 ease-in-out"
              to={`/profile/${currentUser.user.id}`}
            >
              My Profile
            </Link>
          )}
          {currentUser.token && (
            <Link
              className="text-[#252542] font-semibold p-3 hover:text-blue-400 transition-colors duration-300 ease-in-out"
              to="/create"
            >
              New Post
            </Link>
          )}
          <Link
            className="text-[#252542] font-semibold p-3 hover:text-blue-400 transition-colors duration-300 ease-in-out"
            to="/authors"
          >
            Authors
          </Link>
        </ul>

        {/* Logout && Sing In */}
        {currentUser.token ? (
          <button
            onClick={() => {
              dispatch(logOut());
              navigate("/login");
            }}
            className="hidden xl:flex items-center gap-1 text-[#252542] font-semibold hover:text-blue-400 transition-colors duration-300 ease-in-out cursor-pointer"
          >
            Logout <CiLogin className="text-xl" />
          </button>
        ) : (
          <Link
            className="hidden xl:flex items-center gap-1 text-[#252542] font-semibold hover:text-blue-400 transition-colors duration-300 ease-in-out"
            to="/login"
          >
            Sign In <CiLogin className="text-xl" />
          </Link>
        )}

        {/* Mobile Menu Icon */}
        <BiMenu
          className="xl:hidden block text-5xl text-[#252542] cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-25 w-full flex flex-col items-center gap-1 z-40 py-4 font-semibold text-lg bg-white shadow-md select-none">
          {currentUser.token && (
            <Link
              className="text-[#252542] p-3 hover:text-blue-400 transition-colors duration-300 ease-in-out"
              to={`/profile/${currentUser.user.id}`}
              onClick={() => setIsMenuOpen(false)}
            >
              My Profile
            </Link>
          )}
          {currentUser.token && (
            <Link
              className="text-[#252542] p-3 hover:text-blue-400 transition-colors duration-300 ease-in-out"
              to="/create"
              onClick={() => setIsMenuOpen(false)}
            >
              New Post
            </Link>
          )}
          <Link
            className="text-[#252542] p-3 hover:text-blue-400 transition-colors duration-300 ease-in-out"
            to="/authors"
            onClick={() => setIsMenuOpen(false)}
          >
            Authors
          </Link>
          {currentUser.token ? (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                dispatch(logOut());
                navigate("/login");
              }}
              className="flex items-center gap-1 p-3 text-[#252542] hover:text-blue-400 transition-colors duration-300 ease-in-out cursor-pointer"
            >
              Logout <CiLogin className="text-xl" />
            </button>
          ) : (
            <Link
              className="flex items-center gap-1 p-3 text-[#252542] hover:text-blue-400 transition-colors duration-300 ease-in-out"
              to="/login"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In <CiLogin className="text-xl" />
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
