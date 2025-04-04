import mongoose from "mongoose";

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String },
  image: { type: String }, // URL gambar (opsional)
}, { timestamps: true });

const Achievement = mongoose.models.Achievement || mongoose.model("Achievement", AchievementSchema);

export default Achievement;