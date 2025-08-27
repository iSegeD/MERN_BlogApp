// React
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Redux
import { useDispatch } from "react-redux";
import { createPost } from "../reducers/postReducer";

// Form
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createPostSchema } from "../validations/postSchema";

// Hooks & Components
import useAuthRedirect from "../hooks/useAuthRedirect";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Config
import { modules, formats } from "../config/reactQuillConfig";

const CreatePost = () => {
  useAuthRedirect();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [thumbnail, setThumbnail] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    resolver: yupResolver(createPostSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      desc: "",
      tags: "",
      thumbnail: null,
    },
  });

  const handleCreateSubmit = async (data) => {
    const postData = new FormData();
    postData.append("title", data.title);
    postData.append("desc", data.desc);
    postData.append("tags", data.tags || "");
    postData.append("thumbnail", data.thumbnail);

    const result = await dispatch(createPost(postData));

    if (result.success) {
      navigate("/");
      return;
    }

    if (!result.success && result.message) {
      if (result.message.includes("Thumbnail too large")) {
        setError("thumbnail", { type: "server", message: result.message });
      }
    }
  };

  return (
    <section className="container mx-auto my-10 lg:my-24 p-4">
      {/* Create Post */}
      <div className="p-6 bg-white rounded shadow-lg">
        <h2 className="my-15 text-center text-3xl text-gray-700 font-bold after:content-[''] after:block after:w-20 after:h-[2px] after:bg-gray-300 after:mx-auto after:mt-2 select-none">
          Create post
        </h2>

        {/* Create Post form */}
        <form onSubmit={handleSubmit(handleCreateSubmit)}>
          <input
            className={`px-3 py-2 w-full rounded border focus:outline-none focus:ring-2 ${
              errors.title?.message
                ? "focus:ring-red-400 border-red-300"
                : "focus:ring-blue-400 border-slate-300"
            }`}
            type="text"
            placeholder="Title"
            {...register("title")}
          />
          <p className="mt-1 ml-1 text-sm font-semibold text-red-600">
            {errors.title?.message}
          </p>
          <input
            className={`mt-5 px-3 py-2 w-full rounded border focus:outline-none focus:ring-2 ${
              errors.tags?.message
                ? "focus:ring-red-400 border-red-300"
                : "focus:ring-blue-400 border-slate-300"
            }`}
            type="text"
            placeholder="e.g. sport, health, news"
            {...register("tags")}
          />
          <p className="mt-1 ml-1 text-sm font-semibold text-red-600 ">
            {errors.tags?.message}
          </p>

          <div className="mt-5 h-65">
            <Controller
              name="desc"
              control={control}
              render={({ field }) => (
                <ReactQuill
                  className="h-full"
                  {...field}
                  modules={modules}
                  formats={formats}
                />
              )}
            />
          </div>
          <p className="mt-24 sm:mt-12 ml-1 text-sm font-semibold text-red-600">
            {errors.desc?.message || "\u00A0"}
          </p>

          {/* Download file label */}
          <div className="flex items-center gap-3 mt-10">
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
              className="hidden"
              type="file"
              name="thumbnail"
              id="thumbnail"
              {...register("thumbnail")}
              onChange={(e) => {
                const file = e.target.files[0];
                setThumbnail(file); // for label
                setValue("thumbnail", file); // for RHF validation
                clearErrors("thumbnail");
              }}
              accept="image/jpeg, image/jpg, image/png, image/webp, image/heic, image/heif"
            />
          </div>
          <p className="mt-2 ml-1 text-sm font-semibold text-red-600">
            {errors.thumbnail?.message}
          </p>
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
