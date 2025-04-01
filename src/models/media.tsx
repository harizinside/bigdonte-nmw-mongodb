import mongoose, { Schema } from "mongoose";

const MediaSchema = new Schema(
  {
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const Media = mongoose.models.Media || mongoose.model("Media", MediaSchema);

export default Media; 