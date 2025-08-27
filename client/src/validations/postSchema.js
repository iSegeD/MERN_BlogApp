import * as yup from "yup";

export const createPostSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .required("Required field")
    .min(3, "Title must be at least 3 characters"),

  desc: yup.string().test("required-and-min", function (value) {
    if (!value || value.trim() === "" || value === "<p><br></p>") {
      return this.createError({ message: "Required field" });
    }

    const div = document.createElement("div");
    div.innerHTML = value;
    const text = div.textContent || div.innerText || "";

    if (text.trim().length < 3) {
      return this.createError({
        message: "Description must be at least 3 characters",
      });
    }

    return true;
  }),

  tags: yup
    .string()
    .trim()
    .optional()
    .test("tags-validation", function (value) {
      if (!value) {
        return true;
      }
      
      const tagArray = value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      if (tagArray.length > 20) {
        return this.createError({ message: "Maximum 20 tags allowed" });
      }

      for (const tag of tagArray) {
        if (tag.length < 2 || tag.length > 20) {
          return this.createError({
            message: "Tags must be 2–20 characters each, separated by commas",
          });
        }
      }

      return true;
    }),

  thumbnail: yup
    .mixed()
    .nullable()
    .test("required-and-type", function (value) {
      if (!value) {
        return this.createError({ message: "Image is required" });
      }

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/heic",
        "image/heif",
      ];

      if (!allowedTypes.includes(value.type)) {
        return this.createError({
          message: "Only images are allowed: jpg, jpeg, png, webp, heic, heif",
        });
      }

      return true;
    }),
});
