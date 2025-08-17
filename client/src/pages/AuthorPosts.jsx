import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPostsByUserId, clearUserPosts } from "../reducers/postReducer";

import PostItem from "../components/PostItem";

const AuthorPosts = () => {
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

  return (
    <section className="mt-10 lg:mt-24">
      {/* Authors Posts */}
      {userPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 w-[85%] mx-auto">
          {userPosts.map((data) => (
            <PostItem key={data.id} {...data} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[50vh]">
          <h2 className="text-center text-base sm:text-2xl gradient-text font-extrabold  uppercase select-none">
            This author hasn't shared any thoughts yet. Check back later!{" "}
          </h2>
        </div>
      )}
    </section>
  );
};

export default AuthorPosts;
