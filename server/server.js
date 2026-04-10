import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

// Routes
import billRoutes from "./routes/billRoutes.js"; // ✅ ADD THIS
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import medicineRoutes from "./routes/medicineRoutes.js"; // ✅ ADD HERE


connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/bills", billRoutes); // ✅ ADD THIS
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medicines", medicineRoutes); // ✅ ADD HERE

// Test route
app.get("/", (req, res) => res.send("API is running..."));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(res.statusCode || 500).json({
    message: err.message || "Server Error",
  });
});
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

app.use(notFound);
app.use(errorHandler);

import dashboardRoutes from "./routes/dashboardRoutes.js";

app.use("/api/dashboard", dashboardRoutes);

// Start server (MUST BE LAST)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));