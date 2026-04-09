import mongoose from "mongoose";

const medicationSchema = mongoose.Schema({
  name: { type: String, required: true },
  dosage: { type: String, required: true },      // e.g., 500mg
  frequency: { type: String, required: true },   // e.g., 2x/day
  duration: { type: String, required: true },    // e.g., 5 days
});

const prescriptionSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    medications: [medicationSchema],
    notes: { type: String },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;