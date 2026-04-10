import express from "express";
const router = express.Router();

import {
  createPrescription,
  getPrescriptions,
  getPrescription,
  updatePrescription,
  deletePrescription,
  generatePrescriptionPDF, // ✅ ADD THIS
} from "../controllers/prescriptionController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

// Create prescription → only doctor
router
  .route("/")
  .post(protect, createPrescription)
  .get(protect, admin, getPrescriptions);

// Generate PDF ✅ (IMPORTANT: place BEFORE :id route to avoid conflict)
router.route("/:id/pdf").get(protect, generatePrescriptionPDF);

// Single prescription routes
router
  .route("/:id")
  .get(protect, admin, getPrescription)
  .put(protect, updatePrescription) // ✅ FIXED (was wrong before)
  .delete(protect, admin, deletePrescription);

router.route("/:id/pdf").get(protect, generatePrescriptionPDF);  

export default router;