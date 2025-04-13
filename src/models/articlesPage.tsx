import mongoose from "mongoose";

const ArticlesPageSchema = new mongoose.Schema(
  {
    title: { type: String },
    headline: { type: String },
    description: { type: String },
    keywords: [{ type: String }],
    image: { type: String },
  },
  { timestamps: true }
);

const ArticlesPage = mongoose.models.ArticlesPage || mongoose.model("ArticlesPage", ArticlesPageSchema);
export default ArticlesPage;