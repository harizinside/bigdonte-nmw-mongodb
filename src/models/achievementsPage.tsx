import mongoose from "mongoose";

const AchievementsPageSchema = new mongoose.Schema(
  {
    title: { type: String },
    headline: { type: String },
    description: { type: String },
    keywords: [{ type: String }],
    image: { type: String },
  },
  { timestamps: true }
);

const AchievementsPage = mongoose.models.AchievementsPage || mongoose.model("AchievementsPage", AchievementsPageSchema);
export default AchievementsPage;