import mongoose from "mongoose";

const BranchsPageSchema = new mongoose.Schema(
  {
    title: { type: String },
    headline: { type: String },
    description: { type: String },
    keywords: [{ type: String }],
    image: { type: String },
  },
  { timestamps: true }
);

const BranchsPage = mongoose.models.BranchsPage || mongoose.model("BranchsPage", BranchsPageSchema);
export default BranchsPage;