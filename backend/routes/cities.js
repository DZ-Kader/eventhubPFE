const express = require("express");
const slugify = require("slugify");
const City = require("../models/City");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// GET all cities (Public)
router.get("/", async (req, res) => {
  try {
    const cities = await City.find().sort({ name: 1 });
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create city (Admin only)
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      return res.status(400).json({ message: "City name is required" });
    }

    const slug = slugify(name, { lower: true, strict: true });
    
    // Check if city exists
    const existing = await City.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "City already exists" });
    }

    const city = await City.create({
      name,
      slug,
      description,
      image: image || "https://images.unsplash.com/photo-1596120497556-9ef0f1712a0d?w=800&q=80"
    });

    res.status(201).json(city);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update city (Admin only)
router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const city = await City.findById(req.params.id);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }

    if (name) {
      city.name = name;
      city.slug = slugify(name, { lower: true, strict: true });
    }
    if (description !== undefined) city.description = description;
    if (image !== undefined) city.image = image;

    await city.save();
    res.json(city);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE city (Admin only)
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const city = await City.findByIdAndDelete(req.params.id);
    if (!city) {
      return res.status(404).json({ message: "City not found" });
    }
    res.json({ message: "City deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
