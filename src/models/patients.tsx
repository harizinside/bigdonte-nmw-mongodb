import mongoose, { Schema } from "mongoose";

const PatientSchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    imageSecond: { type: String },
    description: { type: String },
    slug: { type: String, required: true, unique: true }, 
    id_services: { type: mongoose.Schema.Types.ObjectId, ref: "Services", required: true }, 
    id_servicesList: { type: mongoose.Schema.Types.ObjectId, ref: "ServicesList", required: true }, 
    id_servicesType: { type: mongoose.Schema.Types.ObjectId, ref: "ServicesType", required: true }, 
  },
  { timestamps: true }
);

const Patients = mongoose.models.Patients || mongoose.model("Patients", PatientSchema);

export default Patients;