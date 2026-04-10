import mongoose from "mongoose";

const medicationSchema = mongoose.Schema({
  medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true }, // NEW
  name: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  duration: { type: String, required: true },
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