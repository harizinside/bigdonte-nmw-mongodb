import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true }, // URL Google Maps
    operasional: { type: [String], required: true }, // Array jam operasional
    image: { type: String, required: true }, // URL gambar cabang
  },
  { timestamps: true }
);

const Branch = mongoose.models.Branch || mongoose.model("Branch", BranchSchema);
export default Branch;