import Medicine from "../models/Medicine.js";
import StockTransaction from "../models/stockTransaction.js";
import asyncHandler from "express-async-handler";

// @desc    Add new medicine
// @route   POST /api/medicines
// @access  Private/Admin
const addMedicine = asyncHandler(async (req, res) => {
  const { name, brand, category, quantity, unit, price, expiryDate, manufacturer } = req.body;

  if (!name || !price || !expiryDate) {
    res.status(400);
    throw new Error("Name, price and expiryDate are required");
  }

  const medicine = await Medicine.create({
    name,
    brand,
    category,
    quantity: quantity || 0,
    unit: unit || "tablet",
    price,
    expiryDate,
    manufacturer,
  });

  res.status(201).json(medicine);
});

// @desc    Get all medicines
// @route   GET /api/medicines
// @access  Private/Admin
const getMedicines = asyncHandler(async (req, res) => {
  const medicines = await Medicine.find({});
  res.json(medicines);
});

// @desc    Get single medicine
// @route   GET /api/medicines/:id
// @access  Private/Admin
const getMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }
  res.json(medicine);
});

// @desc    Update medicine
// @route   PUT /api/medicines/:id
// @access  Private/Admin
const updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  Object.assign(medicine, req.body); // update all fields
  const updated = await medicine.save();
  res.json(updated);
});

// @desc    Delete medicine
// @route   DELETE /api/medicines/:id
// @access  Private/Admin
const deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  await medicine.deleteOne();
  res.json({ message: "Medicine deleted" });
});

// @desc    Issue medicine (reduce stock)
// @route   POST /api/medicines/:id/issue
// @access  Private/Admin/Pharmacist
const issueMedicine = asyncHandler(async (req, res) => {
  const { quantity, notes } = req.body;

  if (!quantity || quantity <= 0) {
    res.status(400);
    throw new Error("Quantity must be greater than zero");
  }

  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  if (medicine.quantity < quantity) {
    res.status(400);
    throw new Error("Not enough stock available");
  }

  medicine.quantity -= quantity;
  await medicine.save();

  // record stock transaction
  await StockTransaction.create({
    medicine: medicine._id,
    type: "OUT",
    quantity,
    notes: notes || "Issued medicine",
  });

  res.json({ message: `Issued ${quantity} units of ${medicine.name}`, medicine });
});

// @desc    Get low stock medicines
// @route   GET /api/medicines/low-stock
// @access  Private/Admin
const getLowStock = asyncHandler(async (req, res) => {
  const threshold = req.query.threshold ? Number(req.query.threshold) : 5;
  const medicines = await Medicine.find({ quantity: { $lte: threshold } });
  res.json(medicines);
});

// @desc    Get expired medicines
// @route   GET /api/medicines/expired
// @access  Private/Admin
const getExpired = asyncHandler(async (req, res) => {
  const today = new Date();
  const medicines = await Medicine.find({ expiryDate: { $lte: today } });
  res.json(medicines);
});

export {
  addMedicine,
  getMedicines,
  getMedicine,
  updateMedicine,
  deleteMedicine,
  issueMedicine,
  getLowStock,
  getExpired,
};