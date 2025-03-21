import mongoose, { Schema } from "mongoose";

const PromoSchema = new Schema(
  {
    image: { type: String, required: true },
    slug: { type: String, unique: true }, 
    link: { type: String, required: false },
    title: { type: String, required: false },
    sk: { type: String, required: false },
    start_date: { type: String, required: false },
    end_date: { type: String, required: false },
  },
  { timestamps: true }
);

const Promo = mongoose.models.Promo || mongoose.model("Promo", PromoSchema);

export default Promo; 