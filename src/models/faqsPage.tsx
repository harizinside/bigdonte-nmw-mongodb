import mongoose from "mongoose";

const FaqsPageSchema = new mongoose.Schema(
  {
    title: { type: String },
    headline: { type: String },
    description: { type: String },
    keywords: [{ type: String }],
    image: { type: String },
  },
  { timestamps: true }
);

const FaqsPage = mongoose.models.FaqsPage || mongoose.model("FaqsPage", FaqsPageSchema);
export default FaqsPage;