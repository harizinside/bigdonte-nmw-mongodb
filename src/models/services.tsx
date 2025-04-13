import mongoose, { Schema } from "mongoose";

const ServicesSchema = new Schema(
  {
    name: { type: String, required: true },
    imageBanner: { type: String },
    imageCover: { type: String },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, 
    phone: { type: String, required: true },
    template: { type: Boolean, required: true }, 
    keywords: [{ type: String }],
  },
  { timestamps: true }
);

const Services = mongoose.models.Services || mongoose.model("Services", ServicesSchema);

export default Services;