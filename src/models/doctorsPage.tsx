import mongoose from "mongoose";

const DoctorsPageSchema = new mongoose.Schema(
  {
    title: { type: String },
    headline: { type: String },
    description: { type: String },
    keywords: [{ type: String }],
    image: { type: String },
  },
  { timestamps: true }
);

const DoctorsPage = mongoose.models.DoctorsPage || mongoose.model("DoctorsPage", DoctorsPageSchema);
export default DoctorsPage;