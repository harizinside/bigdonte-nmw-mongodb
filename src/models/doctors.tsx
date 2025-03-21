import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  id_position: { type: mongoose.Schema.Types.ObjectId, ref: "Position", required: true }, 
  image: { type: String, required: true }, // URL gambar (opsional)
}, { timestamps: true });

const Doctor = mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);

export default Doctor;
