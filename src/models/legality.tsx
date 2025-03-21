import mongoose from "mongoose";

const LegalitySchema = new mongoose.Schema({
  privacyPolicy: { type: String, required: true },
  termsCondition: { type: String, required: true  },
}, { timestamps: true });

const Legality = mongoose.models.Legality || mongoose.model("Legality", LegalitySchema);

export default Legality;