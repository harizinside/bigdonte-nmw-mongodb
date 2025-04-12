import mongoose, { Schema } from "mongoose";

const PromoSchema = new Schema(
  {
    image: { type: String },
    keywords: [{ type: String }],
    description: { type: String },
    slug: { type: String },
    link: { type: String, required: false },
    title: { type: String, required: false },
    sk: { type: String, required: false },
    start_date: { type: String, required: false },
    end_date: { type: String, required: false },
  },
  { timestamps: true }
);

PromoSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { slug: { $exists: true, $ne: "" } } }
);

const Promo = mongoose.models.Promo || mongoose.model("Promo", PromoSchema);

export default Promo; 