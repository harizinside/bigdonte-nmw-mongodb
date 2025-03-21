const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, 
  date: { type: Date, required: true },
  description: { type: String, required: true },
  author: { type: String },
  editor: { type: String },
  image: { type: String },
  imageSourceName: { type: String },
  imageSourceLink: { type: String },
  sourceLink: { type: String },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  tags: [{ type: String }],
}, { timestamps: true });

const Article = mongoose.models.Article || mongoose.model("Article", ArticleSchema);
export default Article;