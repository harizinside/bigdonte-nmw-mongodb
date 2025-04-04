import mongoose, { Schema } from "mongoose";

const ServicesListSchema = new Schema(
  {
    name: { type: String, required: true },
    imageBanner: { type: String},
    imageCover: { type: String},
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, 
    sensitive_content: { type: Boolean, required: true },
    id_services: { type: mongoose.Schema.Types.ObjectId, ref: "Services", required: true }, 
  },
  { timestamps: true }
);

const ServicesList = mongoose.models.ServicesList || mongoose.model("ServicesList", ServicesListSchema);

export default ServicesList;