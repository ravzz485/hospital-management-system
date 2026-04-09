import { getAvailableSlots } from "../controllers/slotController.js";
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  addDoctor,
  getDoctors,
  getDoctor,      // make sure your controller exports this
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";

const router = express.Router();

// All routes protected, only admin can manage doctors
router.route("/")
  .post(protect, admin, addDoctor)
  .get(protect, admin, getDoctors);

router.route("/:id")
  .get(protect, admin, getDoctor)
  .put(protect, admin, updateDoctor)
  .delete(protect, admin, deleteDoctor);
// GET available slots for a doctor
router.get("/:id/available-slots", getAvailableSlots);  

export default router;