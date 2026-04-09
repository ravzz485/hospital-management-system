import express from "express";
const router = express.Router();
import {
  createPrescription,
  getPrescriptions,
  getPrescription,
  updatePrescription,
  deletePrescription,
} from "../controllers/prescriptionController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// Create prescription → only doctor
router.route("/").post(protect, createPrescription).get(protect, admin, getPrescriptions);

// Single prescription routes → admin or doctor
router
  .route("/:id")
  .get(protect, admin, getPrescription)
  .put(protect, createPrescription) // doctors can update
  .delete(protect, admin, deletePrescription);

export default router;