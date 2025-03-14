import ImageKit from "imagekit";
import { imagekitConfig } from "./config";

const imagekit = new ImageKit({
  publicKey: imagekitConfig.publicKey,
  privateKey: imagekitConfig.privateKey,
  urlEndpoint: imagekitConfig.urlEndpoint,
});

export const uploadImage = async (file, fileName) => {
  try {
    // Convert file to base64
    const reader = new FileReader();
    const base64Promise = new Promise((resolve) => {
      reader.onloadend = () => {
        const base64 = reader.result.split(",")[1];
        resolve(base64);
      };
    });
    reader.readAsDataURL(file);
    const base64 = await base64Promise;

    // Upload to ImageKit
    const result = await imagekit.upload({
      file: base64,
      fileName: fileName,
      folder: "/wardrobe",
    });

    return result.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
