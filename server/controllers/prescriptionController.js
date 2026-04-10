import Prescription from "../models/prescription.js"; // ✅ use ONE model only
import Medicine from "../models/Medicine.js";
import StockTransaction from "../models/stockTransaction.js";
import asyncHandler from "express-async-handler";
import PDFDocument from "pdfkit";

// =======================================
// CREATE PRESCRIPTION + AUTO STOCK UPDATE
// =======================================
const createPrescription = asyncHandler(async (req, res) => {
  const { patient, doctor, medications, notes } = req.body;

  if (!patient || !doctor || !medications || medications.length === 0) {
    res.status(400);
    throw new Error("Please provide patient, doctor and medications");
  }

  // ✅ Check stock
  for (const med of medications) {
    const medicine = await Medicine.findById(med.medicineId);

    if (!medicine) {
      res.status(404);
      throw new Error(`Medicine not found: ${med.name}`);
    }

    if (medicine.quantity < med.quantity) {
      res.status(400);
      throw new Error(`Not enough stock for ${medicine.name}`);
    }
  }

  // ✅ Create prescription
  const prescription = await Prescription.create({
    patient,
    doctor,
    medications: medications.map((med) => ({
      medicineId: med.medicineId,
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      duration: med.duration,
    })),
    notes,
  });

  // ✅ Deduct stock + log transaction
  for (const med of medications) {
    const medicine = await Medicine.findById(med.medicineId);

    medicine.quantity -= med.quantity;
    await medicine.save();

    await StockTransaction.create({
      medicine: medicine._id,
      type: "OUT",
      quantity: med.quantity,
      notes: `Prescription ${prescription._id}`,
    });
  }

  res.status(201).json(prescription);
});

// ==============================
// GET ALL
// ==============================
const getPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await Prescription.find({})
    .populate("patient", "name email")
    .populate("doctor", "name specialization");

  res.json(prescriptions);
});

// ==============================
// GET SINGLE
// ==============================
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

// ==============================
// UPDATE
// ==============================
const updatePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    res.status(404);
    throw new Error("Prescription not found");
  }

  prescription.medications =
    req.body.medications || prescription.medications;
  prescription.notes = req.body.notes || prescription.notes;
  prescription.status = req.body.status || prescription.status;

  const updated = await prescription.save();
  res.json(updated);
});

// ==============================
// DELETE
// ==============================
const deletePrescription = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id);

  if (!prescription) {
    res.status(404);
    throw new Error("Prescription not found");
  }

  await prescription.deleteOne();
  res.json({ message: "Prescription deleted" });
});

// ==============================
// GENERATE PDF
// ==============================
const generatePrescriptionPDF = asyncHandler(async (req, res) => {
  const prescription = await Prescription.findById(req.params.id)
    .populate("patient", "name email")
    .populate("doctor", "name specialization");

  if (!prescription) {
    res.status(404);
    throw new Error("Prescription not found");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Prescription-${prescription._id}.pdf`
  );

  const doc = new PDFDocument();
  doc.pipe(res);

  doc.fontSize(20).text("Prescription", { align: "center" });
  doc.moveDown();

  doc.fontSize(14).text(`Patient: ${prescription.patient.name}`);
  doc.text(`Email: ${prescription.patient.email}`);
  doc.text(
    `Doctor: Dr. ${prescription.doctor.name} (${prescription.doctor.specialization})`
  );
  doc.text(`Status: ${prescription.status}`);
  doc.moveDown();

  doc.text("Medications:", { underline: true });

  prescription.medications.forEach((med, index) => {
    doc.text(
      `${index + 1}. ${med.name} - ${med.dosage}, ${med.frequency}, ${med.duration}`
    );
  });

  if (prescription.notes) {
    doc.moveDown();
    doc.text("Notes:", { underline: true });
    doc.text(prescription.notes);
  }

  doc.end();
});

// ==============================
// EXPORT
// ==============================
export {
  createPrescription,
  getPrescriptions,
  getPrescription,
  updatePrescription,
  deletePrescription,
  generatePrescriptionPDF,
};