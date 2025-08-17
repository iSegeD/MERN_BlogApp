import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeUsers } from "../reducers/userReducer";

import { Link } from "react-router-dom";

import noAvatar from "../assets/images/noAvatar.png";

const Authors = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.all);
  const isLoading = useSelector((state) => state.user.loading.all);

  useEffect(() => {
    dispatch(initializeUsers());
  }, [dispatch]);

  if (isLoading) {
    return null;
  }

  return (
    <section className="container mx-auto mt-10 lg:mt-24 p-4">
      {/* Authors list */}
      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {users.map(({ id, avatar, username, posts }) => {
            return (
              <Link
                key={id}
                to={`/posts/users/${id}`}
                className="p-4 rounded shadow-sm hover:shadow-lg transition duration-300 ease-in-out bg-white"
              >
                <img
                  src={avatar ? avatar : noAvatar}
                  alt={username}
                  className="mx-auto w-24 h-24 rounded-full object-cover"
                />
                <h4 className="mt-4 text-center text-[#252542] text-lg font-semibold truncate">
                  {username}
                </h4>
                <p className="mt-1 text-center text-[#6F7577]">
                  {posts.length} posts
                </p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[50vh]">
          <h3 className="text-center text-base sm:text-2xl gradient-text font-extrabold uppercase select-none">
            No authors in sight - be the first to join!
          </h3>
        </div>
      )}
    </section>
  );
};

export default Authors;
