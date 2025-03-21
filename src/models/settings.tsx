import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema(
  {
    email: { type: String },
    title: { type: String },
    phone: { type: String },
    meta_description: { type: String }, // URL Google Maps
    logo: { type: String },
    favicon: { type: String },
    address_header: { type: String },
    address_footer: { type: String },
    direct_link: { type: String },
  },
  { timestamps: true }
);

const Setting = mongoose.models.Setting || mongoose.model("Setting", SettingSchema);
export default Setting;