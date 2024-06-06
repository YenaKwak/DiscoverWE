import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Configurazione di Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Configurazione di CloudinaryStorage per multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tours",
    format: async (req, file) => "png",
  },
});

const parser = multer({ storage: storage });

export { cloudinary, storage, parser };
