import express from "express";
const router = express.Router();
import {
  addMedicine,
  getMedicines,
  getMedicine,
  updateMedicine,
  deleteMedicine,
  issueMedicine,
  getLowStock,
  getExpired,
} from "../controllers/medicineController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// CRUD operations
router.route("/").post(protect, admin, addMedicine).get(protect, admin, getMedicines);
router.route("/low-stock").get(protect, admin, getLowStock);
router.route("/expired").get(protect, admin, getExpired);

router
  .route("/:id")
  .get(protect, admin, getMedicine)
  .put(protect, admin, updateMedicine)
  .delete(protect, admin, deleteMedicine);

// Issue medicine
router.route("/:id/issue").post(protect, admin, issueMedicine);

export default router;