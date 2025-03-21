import mongoose, { Schema } from "mongoose";

const PopupsSchema = new Schema(
  {
    image: { type: String, required: true },
    link: { type: String, required: true },
    status: { type: Boolean, required: true },
  },
  { timestamps: true }
);

const Popups = mongoose.models.Popups || mongoose.model("Popups", PopupsSchema);

export default Popups;