import mongoose from "mongoose";

const SocialSchema = new mongoose.Schema({
  icon: { type: String },
  title: { type: String },
  link: { type: String },
}, { timestamps: true });

const Social = mongoose.models.Social || mongoose.model("Social", SocialSchema);

export default Social;