import mongoose from "mongoose";

const ServicesPageSchema = new mongoose.Schema(
  {
    title: { type: String },
    headline: { type: String },
    description: { type: String },
    keywords: [{ type: String }],
    image: { type: String },
  },
  { timestamps: true }
);

const ServicesPage = mongoose.models.ServicesPage || mongoose.model("ServicesPage", ServicesPageSchema);
export default ServicesPage;