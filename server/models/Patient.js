import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;