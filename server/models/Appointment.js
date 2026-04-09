import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema(
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
    date: {
      type: Date,
      required: true,
    },
    // ✅ NEW: Time slot for the appointment
    time: {
      type: String, // e.g., "10:00", "10:30"
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "cancelled"],
      default: "pending",
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

// ✅ Create model
const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;