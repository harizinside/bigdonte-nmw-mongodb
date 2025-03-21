import mongoose, { Schema } from "mongoose";

const ServicesSchema = new Schema(
  {
    name: { type: String, required: true },
    imageBanner: { type: String, required: true },
    imageCover: { type: String, required: true },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, 
    phone: { type: String, required: true },
    template: { type: Boolean, required: true }, 
  },
  { timestamps: true }
);

const Services = mongoose.models.Services || mongoose.model("Services", ServicesSchema);

export default Services;