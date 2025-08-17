import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPostById,
  removePost,
  clearSinglePost,
} from "../reducers/postReducer";
import { Link, useParams, useNavigate } from "react-router-dom";

import Comments from "../components/Comments";

import ReactTimeAgo from "react-time-ago";

import { FiEdit } from "react-icons/fi";
import { GoTrash } from "react-icons/go";

import noAvatar from "../assets/images/noAvatar.png";

const FullPost = () => {
  const { id } = useParams();
  const post = useSelector((state) => state.post.single);
  const currentUser = useSelector((state) => state.auth);
  const isLoading = useSelector((state) => state.post.loading.single);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getPostById(id));
    return () => {
      dispatch(clearSinglePost());
    };
  }, [id, dispatch]);

  const handleRemoveClick = async (id) => {
    const result = await dispatch(removePost(id));

    if (result.success) {
      navigate("/");
    } else {
      navigate("/");
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <section className="container mx-auto my-10 xl:my-24">
        {/* Post Content */}
        {post ? (
          <div className="mx-auto max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl p-10 rounded shadow-lg bg-white ">
            {/* Left part: avatar, time and name */}
            <div className="flex items-center justify-between gap-5">
              <Link
                to={`/posts/users/${post.user._id}`}
                className="flex items-start gap-5 min-w-0 text-[#333] hover:text-[#548EAA] transition-colors duration-300 ease-in-out"
              >
                <img
                  src={post.user.avatar ? post.user.avatar : noAvatar}
                  alt={post.user.username}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />

                <div className="max-w-3xs md:max-w-[80%] truncate">
                  <h5 className="text-sm font-semibold truncate">
                    By: {post.user.username}
                  </h5>
                  <small>
                    <ReactTimeAgo date={new Date(post.createdAt)} />
                  </small>
                </div>
              </Link>

              {/* Right part: icons */}
              {currentUser?.user?.id === post.user._id && (
                <div className="flex items-center justify-center gap-5">
                  <Link to={`/posts/${post._id}/edit`}>
                    <FiEdit className="text-xl hover:text-yellow-600 transition-colors duration-300 ease-in-out" />
                  </Link>
                  <button onClick={() => handleRemoveClick(post._id)}>
                    <GoTrash className="text-xl hover:text-red-400 transition-colors duration-300 ease-in-out cursor-pointer" />
                  </button>
                </div>
              )}
            </div>

            {/* Post title */}
            <h1 className="mt-15 text-center text-3xl font-semibold break-words">
              {post.title}
            </h1>

            {/* Post thumbnail*/}
            <img
              src={post.thumbnail}
              alt="Blog thumbnail"
              className="my-10 mx-auto"
            />

            {/* Post description */}
            <p dangerouslySetInnerHTML={{ __html: post.desc }}></p>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[50vh]">
            <h2 className="text-center text-base sm:text-2xl gradient-text font-extrabold uppercase select-none">
              Post not found{" "}
            </h2>
          </div>
        )}
      </section>

      {post && <Comments post={post} />}
    </>
  );
};

export default FullPost;
