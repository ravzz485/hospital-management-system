import mongoose from "mongoose";

const medicineSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String },
    category: { type: String },
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: "tablet" },
    price: { type: Number, required: true },
    expiryDate: { type: Date, required: true },
    manufacturer: { type: String },
  },
  { timestamps: true }
);

const Medicine = mongoose.model("Medicine", medicineSchema);
export default Medicine;