import mongoose from "mongoose";

const CatalogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  document: { type: String },
  date: { type: String },
  image: { type: String }, // URL gambar (opsional)
}, { timestamps: true });

const Catalog = mongoose.models.Catalog || mongoose.model("Catalog", CatalogSchema);

export default Catalog;