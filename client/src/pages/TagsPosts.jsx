import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostsByTag, clearTagPosts } from "../reducers/postReducer";

import { useParams } from "react-router-dom";

import PostItem from "../components/PostItem";

const TagsPosts = () => {
  const { tag } = useParams();
  const tagPost = useSelector((state) => state.post.tagPosts);
  const isLoading = useSelector((state) => state.post.loading.tags);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPostsByTag(tag));
    return () => {
      dispatch(clearTagPosts());
    };
  }, [tag, dispatch]);

  if (isLoading) {
    return null;
  }

  return (
    <section className="mt-10 lg:mt-24">
      {/* Posts list by tags */}
      {tagPost.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 w-[84%] mx-auto">
          {tagPost.map((data) => (
            <PostItem key={data.id} {...data} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-[50vh]">
          <h2 className="text-center text-base sm:text-2xl gradient-text font-extrabold uppercase select-none">
            Posts not found
          </h2>
        </div>
      )}
    </section>
  );
};

export default TagsPosts;
