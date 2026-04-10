import express from "express";
const router = express.Router();

import {
  createBill,
  getBills,
  markAsPaid,
} from "../controllers/billController.js";

import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(protect, createBill).get(protect, admin, getBills);

router.route("/:id/pay").put(protect, markAsPaid);

export default router;