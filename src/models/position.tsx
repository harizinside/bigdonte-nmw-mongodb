import mongoose from "mongoose";

const PositionSchema = new mongoose.Schema({
  title: { type: String, required: true },
}, { timestamps: true });

const Position = mongoose.models.Position || mongoose.model("Position", PositionSchema);

export default Position;