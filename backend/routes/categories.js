const express = require("express");
const slugify = require("slugify");
const Category = require("../models/Category");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// GET all categories (Public)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create category (Admin only)
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const slug = slugify(name, { lower: true, strict: true });
    
    // Check if category exists
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      slug,
      icon: icon || "calendar",
      description
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update category (Admin only)
router.put("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { name, icon, description } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name, { lower: true, strict: true });
    }
    if (icon) category.icon = icon;
    if (description !== undefined) category.description = description;

    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE category (Admin only)
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
