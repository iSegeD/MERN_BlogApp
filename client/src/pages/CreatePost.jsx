import { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../reducers/postReducer";
import { useNavigate } from "react-router-dom";

import useAuthRedirect from "../hooks/useAuthRedirect";

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { modules, formats } from "../config/reactQuillConfig";

import NotificationMessage from "../components/NotificationMessage";

const CreatePost = () => {
  useAuthRedirect();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const handleCreateSubmit = async (e) => {
    e.preventDefault();

    const cleanDesc = desc.trim() === "<p><br></p>" ? "" : desc;

    const postData = new FormData();

    postData.append("title", title);
    postData.append("desc", cleanDesc);
    postData.append("tags", tags);
    postData.append("thumbnail", thumbnail);

    const result = await dispatch(createPost(postData));

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <section className="container mx-auto my-10 lg:my-24 p-4">
      {/* Create Post */}
      <div className="p-6 bg-white rounded shadow-lg">
        <h2 className="my-10 text-center text-3xl text-gray-700 font-bold after:content-[''] after:block after:w-20 after:h-[2px] after:bg-gray-300 after:mx-auto after:mt-2 select-none">
          Create post
        </h2>

        <NotificationMessage />

        {/* Create Post form */}
        <form className="flex flex-col gap-4" onSubmit={handleCreateSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            className="px-3 py-2 w-full rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
          <input
            type="text"
            name="tags"
            placeholder="e.g. sport, health, news"
            value={tags}
            onChange={({ target }) => setTags(target.value)}
            className="px-3 py-2 w-full rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <div className="h-65">
            <ReactQuill
              value={desc}
              onChange={setDesc}
              modules={modules}
              formats={formats}
              className="h-full"
            />
          </div>

          {/* Download file label */}
          <div className="flex items-center gap-3 mt-30 sm:mt-15">
            <label
              htmlFor="thumbnail"
              className="py-1 px-4 rounded border border-gray-400 hover:bg-gray-100 transition flex-shrink-0"
            >
              Choose file
            </label>

            <div className="text-gray-500 truncate">
              {thumbnail ? thumbnail.name : "No file chosen"}
            </div>

            {/* Hidden input file */}
            <input
              type="file"
              name="thumbnail"
              id="thumbnail"
              className="hidden"
              onChange={({ target }) => setThumbnail(target.files[0])}
              accept="image/png, image/jpg, image/jpeg"
            />
          </div>
          <div className="flex justify-center my-6">
            <button
              type="submit"
              className="py-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 text-white rounded bg-[#376bc0] hover:bg-[#2f5aad] transition-colors duration-300 ease-in-out cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;
