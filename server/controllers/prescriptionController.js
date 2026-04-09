import Prescription from "../models/prescriptionModels.js"; // ✅ FIXED
import asyncHandler from "express-async-handler";

// @desc    Create a prescription
// @route   POST /api/prescriptions
// @access  Private/Doctor
const createPrescription = asyncHandler(async (req, res) => {
  const { patient, doctor, medications, notes } = req.body;

  if (!patient || !doctor || !medications || medications.length === 0) {
    res.status(400);
    throw new Error("Please provide patient, doctor and medications");
  }

  const prescription = await Prescription.create({
    patient,
    doctor,
    medications,
    notes,
  });

  res.status(201).json(prescription);
});

// @desc    Get all prescriptions
// @route   GET /api/prescriptions
// @access  Private/Admin
const getPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await Prescription.find({})
    .populate("patient", "name email")
    .populate("doctor", "name specialization");

  res.json(prescriptions);
});

// @desc    Get single prescription
// @route   GET /api/prescriptions/:id
// @access  Private/Admin
const getPrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate("patient", "name email")
    .populate("doctor", "name specialization");

  if (!prescription) {
    res.status(404);
    throw new Error("Prescription not found");
  }

  res.json(prescription);
});

// @desc    Update prescription
// @route   PUT /api/prescriptions/:id
// @access  Private/Doctor
const updatePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    res.status(404);
    throw new Error("Prescription not found");
  }

  prescription.medications = req.body.medications || prescription.medications;
  prescription.notes = req.body.notes || prescription.notes;
  prescription.status = req.body.status || prescription.status;

  const updated = await prescription.save();
  res.json(updated);
});

// @desc    Delete prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private/Admin
const deletePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    res.status(404);
    throw new Error("Prescription not found");
  }

  await prescription.deleteOne();
  res.json({ message: "Prescription deleted" });
});

export {
  createPrescription,
  getPrescriptions,
  getPrescription,
  updatePrescription,
  deletePrescription,
};