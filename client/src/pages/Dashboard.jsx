import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPostsByUserId,
  clearUserPosts,
  removePost,
} from "../reducers/postReducer";

import { Link, useParams } from "react-router-dom";

import useAuthRedirect from "../hooks/useAuthRedirect";

import { FiEye, FiEdit } from "react-icons/fi";
import { GoTrash } from "react-icons/go";

const Dashboard = () => {
  useAuthRedirect();
  const { id } = useParams();
  const userPosts = useSelector((state) => state.post.userPosts);
  const isLoading = useSelector((state) => state.post.loading.userPosts);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPostsByUserId(id));

    return () => {
      dispatch(clearUserPosts());
    };
  }, [id, dispatch]);

  if (isLoading) {
    return null;
  }

  const handleRemoveClick = async (postId) => {
    await dispatch(removePost(postId));
  };

  return (
    <section className="container mx-auto my-10 lg:my-24 p-4">
      {/* User Post Content */}
      {userPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {userPosts.map(({ id, thumbnail, title }) => {
            return (
              <div key={id} className="p-4 bg-white rounded shadow-lg">
                <img src={thumbnail} alt={title} className="rounded" />
                <h5 className="mt-5 text-center text-lg font-semibold truncate">
                  {title}
                </h5>

                <div className="flex justify-between mt-5">
                  <Link
                    to={`/posts/${id}`}
                    className="p-3 text-[#252542] rounded-xl border border-slate-400 hover:rounded-3xl hover:bg-blue-300 transition-all duration-300 ease-in-out"
                  >
                    <FiEye className="text-lg" />
                  </Link>

                  <Link
                    to={`/posts/${id}/edit`}
                    className="p-3 text-[#252542] rounded-xl border border-slate-400 hover:rounded-3xl hover:bg-yellow-500 transition-all duration-300 ease-in-out"
                  >
                    <FiEdit className="text-lg" />
                  </Link>

                  <button
                    onClick={() => handleRemoveClick(id)}
                    className="p-3 text-[#252542] rounded-xl border border-slate-400 hover:rounded-3xl hover:bg-red-500 transition-all duration-300 ease-in-out cursor-pointer"
                  >
                    <GoTrash className="text-lg" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[50vh]">
          <h2 className="text-center text-base sm:text-2xl gradient-text font-extrabold uppercase select-none">
            Nothing here... yet. Ready to write your first post?{" "}
          </h2>
        </div>
      )}
    </section>
  );
};

export default Dashboard;
