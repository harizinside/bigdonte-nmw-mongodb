import mongoose from "mongoose";

const TermsPageSchema = new mongoose.Schema(
  {
    title: { type: String },
    headline: { type: String },
    description: { type: String },
    keywords: [{ type: String }],
    image: { type: String },
  },
  { timestamps: true }
);

const TermsPage = mongoose.models.TermsPage || mongoose.model("TermsPage", TermsPageSchema);
export default TermsPage;