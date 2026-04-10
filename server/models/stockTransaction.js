import mongoose from "mongoose";

const stockTransactionSchema = mongoose.Schema(
  {
    medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
    type: { type: String, enum: ["IN", "OUT"], required: true },
    quantity: { type: Number, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

const StockTransaction = mongoose.model("StockTransaction", stockTransactionSchema);
export default StockTransaction;