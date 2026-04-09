import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "doctor", "patient", "pharmacist"],
    default: "patient"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);