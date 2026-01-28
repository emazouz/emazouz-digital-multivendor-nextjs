"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      throw new Error("No file provided");
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<{ success: boolean; url?: string; error?: string }>(
      (resolve) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "emazouz-digital/products",
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                resolve({ success: false, error: "Upload failed" });
              } else {
                resolve({ success: true, url: result?.secure_url });
              }
            },
          )
          .end(buffer);
      },
    );
  } catch (error) {
    console.error("Upload action error:", error);
    return { success: false, error: "Internal server error during upload" };
  }
}
