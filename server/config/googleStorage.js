import "dotenv/config";

import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});

export const avatarsBucket = storage.bucket("mern-blog-avatars");
export const thumbnailsBucket = storage.bucket("mern-blog-thumbnails");
