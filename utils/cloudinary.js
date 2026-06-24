import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({ quiet: true });

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

export const uploadFileToCloudinary = async (file) => {
  try {
    if (!file) {
      throw new Error("Upload the file");
    }

    const filePath = file.tempFilePath || file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "uploads",
    });

    return result.secure_url;
  } catch (error) {
    throw new Error(error.message);
  }
};

export default cloudinary;
