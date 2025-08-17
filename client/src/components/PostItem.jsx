import { Link } from "react-router-dom";

import ReactTimeAgo from "react-time-ago";

import { LiaHashtagSolid } from "react-icons/lia";
import { FaEye } from "react-icons/fa";
import { BiMessageRounded } from "react-icons/bi";

import noAvatar from "../assets/images/noAvatar.png";

const PostItem = ({
  id,
  title,
  desc,
  thumbnail,
  user,
  tags,
  viewsCount,
  comments,
  createdAt,
}) => {
  return (
    <article className="flex flex-col h-full p-4 pb-8 rounded bg-white shadow hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-default">
      {/* Post Content */}
      <div className="flex justify-between">
        {/* Left part: avatar, time and name */}
        <Link
          to={`/posts/users/${user.id}`}
          className="flex items-center justify-center gap-4 min-w-0 text-[#252542] hover:text-[#548EAA] transition-colors duration-300 ease-in-out"
        >
          <img
            src={user.avatar ? user.avatar : noAvatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />

          <div className="min-w-0">
            <h5 className="text-xs font-semibold truncate">
              By: {user.username}
            </h5>
            <small>
              <ReactTimeAgo date={new Date(createdAt)} />
            </small>
          </div>
        </Link>

        {/* Right part: icons */}
        <div className="flex flex-col xl:flex-row gap-2 xl:gap-4 ml-4 text-sm font-medium text-gray-600">
          <div className="flex items-center justify-center gap-1">
            <FaEye className="text-gray-400 text-lg" />
            <span>{viewsCount > 999 ? "999+" : viewsCount}</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <BiMessageRounded className="text-gray-400 text-lg" />
            <span>{comments.length > 999 ? "999+" : comments.length}</span>
          </div>
        </div>
      </div>

      <Link
        to={`/posts/${id}`}
        className="mt-5 max-w-max text-[#333] hover:text-[#548EAA] transition-colors duration-300 ease-in-out"
      >
        <h1 className="text-2xl font-bold truncate">{title}</h1>
      </Link>

      <div className="my-5 h-65">
        <img
          className="w-full h-full object-cover"
          src={thumbnail}
          alt={title}
        />
      </div>

      <p
        className="line-clamp-3 mb-5"
        dangerouslySetInnerHTML={{ __html: desc }}
      ></p>

      <hr className="border-gray-300" />

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap pt-4 gap-2 truncate">
          {tags.map((item) =>
            item ? (
              <Link
                key={item}
                to={`/posts/tags/${item}`}
                className="flex items-center whitespace-nowrap text-[#6F7577] text-base font-medium hover:text-[#548EAA] transition-colors duration-300 ease-in-out"
              >
                <LiaHashtagSolid />
                {item}
              </Link>
            ) : null
          )}
        </div>
      )}
    </article>
  );
};

export default PostItem;
