import mongoose from "mongoose";

const CatalogsPageSchema = new mongoose.Schema(
  {
    title: { type: String },
    headline: { type: String },
    description: { type: String },
    keywords: [{ type: String }],
    image: { type: String },
  },
  { timestamps: true }
);

const CatalogsPage = mongoose.models.CatalogsPage || mongoose.model("CatalogsPage", CatalogsPageSchema);
export default CatalogsPage;