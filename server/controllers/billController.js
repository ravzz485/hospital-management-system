import Bill from "../models/Bill.js";
import Prescription from "../models/prescriptionModels.js";
import asyncHandler from "express-async-handler";
import PDFDocument from "pdfkit";

// ==============================
// CREATE BILL FROM PRESCRIPTION
// ==============================
const createBill = asyncHandler(async (req, res) => {
  const { prescriptionId, consultationFee } = req.body;

  const prescription = await Prescription.findById(prescriptionId);

  if (!prescription) {
    res.status(404);
    throw new Error("Prescription not found");
  }

  // 💊 Calculate medicine cost
  let medicines = [];
  let medicineTotal = 0;

  prescription.medications.forEach((med) => {
    const price = 10; // 👉 you can improve later (fetch from Medicine model)
    const quantity = 1;

    medicineTotal += price * quantity;

    medicines.push({
      name: med.name,
      quantity,
      price,
    });
  });

  const totalAmount = medicineTotal + (consultationFee || 0);

  const bill = await Bill.create({
    patient: prescription.patient,
    doctor: prescription.doctor,
    medicines,
    consultationFee,
    totalAmount,
  });

  res.status(201).json(bill);
});

// ==============================
// GET ALL BILLS
// ==============================
const getBills = asyncHandler(async (req, res) => {
  const bills = await Bill.find({})
    .populate("patient", "name")
    .populate("doctor", "name");

  res.json(bills);
});

// ==============================
// MARK AS PAID
// ==============================
const markAsPaid = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);

  if (!bill) {
    res.status(404);
    throw new Error("Bill not found");
  }

  bill.paymentStatus = "paid";
  await bill.save();

  res.json({ message: "Payment successful", bill });

});
// @desc    Generate Bill PDF
// @route   GET /api/bills/:id/pdf
// @access  Private
const generateBillPDF = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id)
    .populate("patient", "name email")
    .populate("doctor", "name specialization");

  if (!bill) {
    res.status(404);
    throw new Error("Bill not found");
  }

  // Set headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Bill-${bill._id}.pdf`
  );

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  // 🏥 Hospital Title
  doc.fontSize(20).text("Hospital Management System", { align: "center" });
  doc.moveDown();

  doc.fontSize(16).text("INVOICE", { align: "center" });
  doc.moveDown(2);

  // 👤 Patient Details
  doc.fontSize(12).text(`Patient: ${bill.patient.name}`);
  doc.text(`Email: ${bill.patient.email}`);
  doc.text(`Doctor: Dr. ${bill.doctor.name} (${bill.doctor.specialization})`);
  doc.text(`Status: ${bill.status}`);
  doc.text(`Date: ${new Date().toLocaleDateString()}`);
  doc.moveDown();

  // 💊 Items Table Header
  doc.fontSize(14).text("Items:", { underline: true });
  doc.moveDown(0.5);

  let total = 0;

  bill.items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    doc.fontSize(12).text(
      `${index + 1}. ${item.name} - ${item.quantity} x Rs.${item.price} = Rs.${itemTotal}`
    );
  });

  doc.moveDown();

  // 💰 Total
  doc.fontSize(14).text(`Total Amount: Rs.${total}`, { align: "right" });

  doc.moveDown();
  doc.fontSize(12).text("Thank you for your visit!", { align: "center" });

  doc.end();
});

export { createBill, getBills, markAsPaid, generateBillPDF};