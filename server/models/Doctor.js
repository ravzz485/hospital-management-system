import mongoose from "mongoose";

const doctorSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    specialization: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, default: "doctor" },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;