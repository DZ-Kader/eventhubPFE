const express = require("express");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// POST /api/registrations - Register for an event (Internal only)
router.post("/", authenticate, async (req, res) => {
  try {
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if event allows internal registration
    if (event.registrationType !== "internal") {
      return res.status(400).json({ message: "This event does not support internal registration." });
    }

    // Check if registration is closed (deadline passed or event cancelled/completed)
    if (event.status !== "published") {
      return res.status(400).json({ message: "Registrations are closed for this event." });
    }

    if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({ message: "Registration deadline has passed." });
    }

    // Check if already registered
    const existing = await Registration.findOne({ event: eventId, user: req.user.id });
    if (existing) {
      return res.status(400).json({ message: "You are already registered for this event." });
    }

    // Check capacity
    const count = await Registration.countDocuments({ event: eventId, status: "confirmed" });
    if (event.capacity && count >= event.capacity) {
      return res.status(400).json({ message: "This event has reached its maximum capacity." });
    }

    // Generate a unique ticket code: e.g. TKT-[random string]-[timestamp]
    const ticketCode = `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const registration = await Registration.create({
      event: eventId,
      user: req.user.id,
      ticketCode,
      status: "confirmed"
    });

    // Update current attendees count on event
    event.currentAttendees = (event.currentAttendees || 0) + 1;
    await event.save();

    const populated = await Registration.findById(registration._id)
      .populate("event");

    res.status(201).json(populated);
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/registrations/my & /my-tickets - Get authenticated user's registrations
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate({
        path: "event",
        populate: [
          { path: "venue" },
          { path: "city" }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

router.get("/my", authenticate, getMyRegistrations);
router.get("/my-tickets", authenticate, getMyRegistrations);

// GET /api/registrations/event/:eventId - Get registrations for a specific event (Organizer/Admin only)
router.get("/event/:eventId", authenticate, async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Unauthorized." });
    }

    const registrations = await Registration.find({ event: eventId })
      .populate("user", "name email phone profileImage")
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
