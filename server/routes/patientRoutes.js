import express from "express";
import {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only admin can manage patients
router.route("/")
  .get(protect, admin, getPatients)
  .post(protect, admin, createPatient);

router.route("/:id")
  .get(protect, admin, getPatientById)
  .put(protect, admin, updatePatient)
  .delete(protect, admin, deletePatient);

export default router;