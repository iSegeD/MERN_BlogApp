import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializePosts } from "../reducers/postReducer";

import PostItem from "./PostItem";

import { CiSearch } from "react-icons/ci";

const Posts = () => {
  const posts = useSelector((state) => state.post.all);
  const isLoading = useSelector((state) => state.post.loading.all);
  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const filteredPost = useMemo(() => {
    if (!search.trim()) {
      return posts;
    }
    const lowerFilter = search.toLowerCase().trim();
    return posts.filter((post) =>
      post.title.toLowerCase().includes(lowerFilter)
    );
  }, [posts, search]);

  useEffect(() => {
    dispatch(initializePosts());
  }, [dispatch]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <section className="flex items-center justify-center mt-10">
        <div className="relative">
          <CiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Post title..."
            value={search}
            onChange={({ target }) => setSearch(target.value)}
            className="pl-10 pr-3 py-2 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition "
          />
        </div>
      </section>

      <section className="mt-10 lg:mt-24">
        {posts.length === 0 ? (
          search.trim() === "" ? (
            <div className="flex items-center justify-center h-[50vh]">
              <h2 className="text-center text-base sm:text-2xl gradient-text font-extrabold uppercase select-none">
                An empty canvas awaits - paint it with your words!
              </h2>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[50vh]">
              <h2 className="text-center text-base sm:text-2xl gradient-text font-extrabold uppercase select-none">
                No posts found matching your search
              </h2>
            </div>
          )
        ) : filteredPost.length === 0 ? (
          <div className="flex items-center justify-center h-[50vh]">
            <h2 className="text-center text-base sm:text-2xl gradient-text font-extrabold uppercase select-none">
              No posts found matching your search
            </h2>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 w-[85%] mx-auto">
            {filteredPost.map((data) => (
              <PostItem key={data.id} {...data} />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Posts;
