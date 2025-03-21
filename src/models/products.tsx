import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String },
  link: { type: String },
  description: { type: String}, // URL gambar (opsional)
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;