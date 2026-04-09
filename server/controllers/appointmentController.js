import Appointment from "../models/Appointment.js";
import asyncHandler from "express-async-handler";

// @desc Create appointment
// @route POST /api/appointments
// @access Private
const createAppointment = asyncHandler(async (req, res) => {
  const { patient, doctor, date, time, notes } = req.body;

  if (!patient || !doctor || !date || !time) {
    res.status(400);
    throw new Error("Please fill all required fields (patient, doctor, date, time)");
  }

  // ✅ Prevent double booking: same doctor, same date and time
  const existing = await Appointment.findOne({ doctor, date, time });
  if (existing) {
    res.status(400);
    throw new Error("This time slot is already booked for the doctor");
  }

  const appointment = await Appointment.create({
    patient,
    doctor,
    date,
    time,
    notes,
  });

  res.status(201).json(appointment);
});

// @desc Get all appointments
// @route GET /api/appointments
// @access Private/Admin
const getAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({})
    .populate("patient", "name email")
    .populate("doctor", "name specialization");

  res.json(appointments);
});

// @desc Get single appointment
// @route GET /api/appointments/:id
// @access Private/Admin
const getAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id)
    .populate("patient", "name email")
    .populate("doctor", "name specialization");

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  res.json(appointment);
});

// @desc Update appointment
// @route PUT /api/appointments/:id
// @access Private/Admin
const updateAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  // ✅ If date or time changes, check for double booking
  const newDate = req.body.date || appointment.date;
  const newTime = req.body.time || appointment.time;

  if (req.body.date || req.body.time) {
    const existing = await Appointment.findOne({
      doctor: appointment.doctor,
      date: newDate,
      time: newTime,
      _id: { $ne: appointment._id }, // ignore current appointment
    });
    if (existing) {
      res.status(400);
      throw new Error("This time slot is already booked for the doctor");
    }
  }

  appointment.date = newDate;
  appointment.time = newTime;
  appointment.status = req.body.status || appointment.status;
  appointment.notes = req.body.notes || appointment.notes;

  const updated = await appointment.save();
  res.json(updated);
});

// @desc Delete appointment
// @route DELETE /api/appointments/:id
// @access Private/Admin
const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error("Appointment not found");
  }

  await appointment.deleteOne();
  res.json({ message: "Appointment deleted" });
});

export {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
};