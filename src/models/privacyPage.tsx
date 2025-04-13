import mongoose from "mongoose";

const PrivacyPageSchema = new mongoose.Schema(
  {
    title: { type: String },
    headline: { type: String },
    description: { type: String },
    keywords: [{ type: String }],
    image: { type: String },
  },
  { timestamps: true }
);

const PrivacyPage = mongoose.models.PrivacyPage || mongoose.model("PrivacyPage", PrivacyPageSchema);
export default PrivacyPage;