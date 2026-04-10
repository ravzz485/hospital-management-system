import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Prescription from "../models/prescriptionModels.js";
import Medicine from "../models/Medicine.js";
import Bill from "../models/Bill.js";

const getDashboardStats = asyncHandler(async (req, res) => {
  const totalPatients = await User.countDocuments({ role: "patient" });
  const totalDoctors = await User.countDocuments({ role: "doctor" });
  const totalPrescriptions = await Prescription.countDocuments();

  const bills = await Bill.find();
  const totalRevenue = bills.reduce((acc, bill) => acc + bill.totalAmount, 0);

  const lowStock = await Medicine.find({ quantity: { $lt: 10 } });

  res.json({
    totalPatients,
    totalDoctors,
    totalPrescriptions,
    totalRevenue,
    lowStock,
  });
});

export { getDashboardStats };