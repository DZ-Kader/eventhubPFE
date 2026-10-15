const express = require("express");
const User = require("../models/User");
const Event = require("../models/Event");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

// GET /api/favorites - Get user's favorite events
router.get("/", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "favorites",
      populate: [
        { path: "city" },
        { path: "category" },
        { path: "venue" }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.favorites || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/favorites/:eventId - Add to favorites
router.post("/:eventId", authenticate, async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.favorites.includes(eventId)) {
      return res.status(400).json({ message: "Event is already in favorites" });
    }

    user.favorites.push(eventId);
    await user.save();

    res.json({ message: "Event added to favorites", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/favorites/:eventId - Remove from favorites
router.delete("/:eventId", authenticate, async (req, res) => {
  try {
    const { eventId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.favorites = user.favorites.filter(id => id.toString() !== eventId);
    await user.save();

    res.json({ message: "Event removed from favorites", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
