import multer from "multer";

const imageFileFilter = (req, file, cb) => {
  // Allowed MIME types for images
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only images are allowed: jpg, jpeg, png, webp, heic, heif"),
      false
    );
  }
};

// Memory storage for Profile avatar
const avatarStorage = multer.memoryStorage();
export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: imageFileFilter,
});

// Memory storage for Posts thumbnail
const memoryStorage = multer.memoryStorage();
export const uploadPost = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
});
