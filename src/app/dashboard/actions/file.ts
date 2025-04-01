import axios from "axios";
import { useEffect, useState } from "react";

interface Media {
  imageUrl: any;
  _id: string;
  url: string;
}

export const uploadFile = async (image: File) => {
  if (!image) {
    console.error("No image provided");
    return;
  }

  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await axios.post("/api/media", formData, {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 201) {
      console.log("Image uploaded successfully");
      return response.data; // Return the uploaded data if needed
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

export const readAllImages = async () => {
    try {
      const response = await fetch(`/api/media?page=all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch images");
      }
  
      const result = await response.json();
      return result.media || []; // Pastikan hanya array gambar yang dikembalikan
    } catch (error) {
      console.error("Error fetching images:", error);
      return [];
    }
};  

export const removeImage = async (_id: string) => {
  if (!_id) {
    console.error("No image ID provided");
    return;
  }

  try {
    const response = await fetch(`/api/media/${_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete image");
    }

    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
};
