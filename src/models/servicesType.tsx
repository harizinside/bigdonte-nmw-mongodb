import mongoose, { Schema } from "mongoose";

const ServicesTypeSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, 
    id_services: { type: mongoose.Schema.Types.ObjectId, ref: "Services", required: true }, 
    id_servicesList: { type: mongoose.Schema.Types.ObjectId, ref: "ServicesList", required: true }, 
  },
  { timestamps: true }
);

const ServicesType = mongoose.models.ServicesType || mongoose.model("ServicesType", ServicesTypeSchema);

export default ServicesType;