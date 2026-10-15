const express = require("express");
const Venue = require("../models/Venue");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// GET all venues (Public)
router.get("/", async (req, res) => {
  try {
    const venues = await Venue.find().populate("city", "name slug");
    res.json(venues);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create venue (Admin only)
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, city, address, description, capacity, image } = req.body;
    if (!name || !city || !address) {
      return res.status(400).json({ message: "Name, city, and address are required" });
    }

    const venue = await Venue.create({
      name,
      city,
      address,
      description,
      capacity: capacity || 100,
      image: image || ""
    });

    const populatedVenue = await Venue.findById(venue._id).populate("city", "name slug");
    res.status(201).json(populatedVenue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update venue (Admin only)
router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, city, address, description, capacity, image } = req.body;
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    if (name) venue.name = name;
    if (city) venue.city = city;
    if (address) venue.address = address;
    if (description !== undefined) venue.description = description;
    if (capacity !== undefined) venue.capacity = capacity;
    if (image !== undefined) venue.image = image;

    await venue.save();
    const populatedVenue = await Venue.findById(venue._id).populate("city", "name slug");
    res.json(populatedVenue);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE venue (Admin only)
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    res.json({ message: "Venue deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
