import Doctor from "../models/Doctor.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

// @desc    Add new doctor
// @route   POST /api/doctors
// @access  Private/Admin
const addDoctor = asyncHandler(async (req, res) => {
  const { name, email, password, specialization, phone } = req.body;

  // ✅ include phone in validation
  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const doctor = await Doctor.create({
    name,
    email,
    password: hashedPassword,
    specialization,
    phone, // ✅ ADD THIS
  });

  res.status(201).json(doctor);
});

// @desc    Get all doctors
const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({});
  res.json(doctors);
});

// @desc    Get single doctor
const getDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }
  res.json(doctor);
});

// @desc    Update doctor
const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  const { name, email, password, specialization, phone } = req.body;

  doctor.name = name || doctor.name;
  doctor.email = email || doctor.email;
  doctor.specialization = specialization || doctor.specialization;
  doctor.phone = phone || doctor.phone; // ✅ ADD THIS

  if (password) {
    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(password, salt);
  }

  const updatedDoctor = await doctor.save();
  res.json(updatedDoctor);
});

// @desc    Delete doctor
const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) {
    res.status(404);
    throw new Error("Doctor not found");
  }

  await doctor.deleteOne(); // ✅ better than remove()
  res.json({ message: "Doctor removed" });
});

export { addDoctor, getDoctors, getDoctor, updateDoctor, deleteDoctor };