import asyncHandler from "express-async-handler";
import Appointment from "../models/Appointment.js";

// @desc Get available slots for a doctor on a specific date
// @route GET /api/doctors/:id/available-slots?date=YYYY-MM-DD
// @access Private
const getAvailableSlots = asyncHandler(async (req, res) => {
  const doctorId = req.params.id;
  const { date } = req.query;

  if (!date) {
    res.status(400);
    throw new Error("Please provide a date");
  }

  // All possible slots (adjust to your clinic timings)
  const allSlots = [
    "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30"
  ];

  // Find booked appointments for that doctor on that date
  const bookedAppointments = await Appointment.find({
    doctor: doctorId,
    date: {
      $gte: new Date(date + "T00:00:00"),
      $lte: new Date(date + "T23:59:59")
    }
  });

  const bookedSlots = bookedAppointments.map(a => a.date.toTimeString().slice(0,5));

  // Filter available slots
  const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

  res.json({ doctor: doctorId, date, availableSlots });
});

export { getAvailableSlots };