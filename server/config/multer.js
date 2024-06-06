import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Configurazione di Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Configurazione dello storage di Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "tours",
    format: async (req, file) => "png", // Formato del file
    public_id: (req, file) => file.originalname.split(".")[0], // Nome del file
  },
});

// Configurazione di multer con lo storage di Cloudinary
const parser = multer({ storage: storage });

export default parser;
