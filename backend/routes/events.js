const express = require("express");
const mongoose = require("mongoose");
const slugify = require("slugify");
const Event = require("../models/Event");
const { authenticate, authorize } = require("../middleware/auth");
const router = express.Router();

// GET /api/events - Discover & Catalog with filtering
router.get("/", async (req, res) => {
  try {
    const { category, city, search, status, isFeatured, limit, page } = req.query;

    const query = {};

    // Public defaults to only showing published events unless status specified
    if (status) {
      query.status = status;
    } else {
      query.status = "published";
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === "true";
    }

    // Category Filter (ID or Match)
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const Category = require("../models/Category");
        const catMatch = await Category.findOne({
          $or: [{ slug: category }, { name: new RegExp(category, "i") }]
        });
        if (catMatch) {
          query.category = catMatch._id;
        } else {
          return res.json({ events: [], total: 0, page: 1, pages: 0 });
        }
      }
    }

    // City Filter (ID or Match)
    if (city) {
      if (mongoose.Types.ObjectId.isValid(city)) {
        query.city = city;
      } else {
        const City = require("../models/City");
        const cityMatch = await City.findOne({
          $or: [{ slug: city }, { name: new RegExp(city, "i") }]
        });
        if (cityMatch) {
          query.city = cityMatch._id;
        } else {
          return res.json({ events: [], total: 0, page: 1, pages: 0 });
        }
      }
    }

    // Search Keyword Filter
    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { shortDescription: new RegExp(search, "i") },
        { description: new RegExp(search, "i") }
      ];
    }

    const pageSize = parseInt(limit) || 12;
    const pageNum = parseInt(page) || 1;
    const skip = (pageNum - 1) * pageSize;

    const events = await Event.find(query)
      .populate("category")
      .populate("city")
      .populate("venue")
      .populate("organizer", "name email profileImage phone")
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(pageSize);

    const total = await Event.countDocuments(query);

    res.json({
      events,
      total,
      page: pageNum,
      pages: Math.ceil(total / pageSize)
    });

  } catch (err) {
    console.error("Fetch Events Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/mine - Get organizer's own events
router.get("/mine", authenticate, authorize("organizer", "admin"), async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id })
      .populate("category")
      .populate("city")
      .populate("venue")
      .sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/events/:id - View single event details (supports ID or slug)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let event;

    if (mongoose.Types.ObjectId.isValid(id)) {
      event = await Event.findById(id);
    } else {
      event = await Event.findOne({ slug: id });
    }

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Increment view count asynchronously
    event.views += 1;
    await event.save();

    const populatedEvent = await event.populate([
      { path: "category" },
      { path: "city" },
      { path: "venue" },
      { path: "organizer", select: "name email profileImage phone" }
    ]);

    // Find related events (same category, different ID)
    const related = await Event.find({
      category: populatedEvent.category._id,
      _id: { $ne: populatedEvent._id },
      status: "published"
    })
      .limit(3)
      .populate("city")
      .populate("venue");

    res.json({
      event: populatedEvent,
      related
    });

  } catch (err) {
    console.error("Get Single Event Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/events - Create new event (Organizer/Admin only)
router.post("/", authenticate, authorize("organizer", "admin"), async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const slug = slugify(title, { lower: true, strict: true }) + "-" + Date.now().toString().slice(-4);
    const initialStatus = req.body.status === "draft" ? "draft" : "pending";

    const event = await Event.create({
      ...req.body,
      slug,
      organizer: req.user.id,
      status: initialStatus
    });

    const populated = await Event.findById(event._id)
      .populate("category")
      .populate("city")
      .populate("venue");

    res.status(201).json(populated);
  } catch (err) {
    console.error("Create Event Error:", err);
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/events/:id - Edit event (Organizer edits own, Admin edits any)
router.put("/:id", authenticate, authorize("organizer", "admin"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this event" });
    }

    const updateData = { ...req.body };
    if (event.status === "rejected") {
      updateData.status = "draft";
      updateData.rejectionReason = "";
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate("category")
      .populate("city")
      .populate("venue");

    res.json(updatedEvent);
  } catch (err) {
    console.error("Update Event Error:", err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/events/:id - Delete event (Owner/Admin only)
router.delete("/:id", authenticate, authorize("organizer", "admin"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/events/:id/submit - Submit event for review
router.put("/:id/submit", authenticate, authorize("organizer", "admin"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    event.status = "pending";
    await event.save();
    res.json({ message: "Event submitted for admin approval", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/events/:id/approve - Approve event (Admin only)
router.put("/:id/approve", authenticate, authorize("admin"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.status = "published";
    event.rejectionReason = "";
    await event.save();
    res.json({ message: "Event approved and published successfully", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/events/:id/reject - Reject event (Admin only)
router.put("/:id/reject", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { reason } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.status = "rejected";
    event.rejectionReason = reason || "Content does not satisfy requirements";
    await event.save();
    res.json({ message: "Event rejected", event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;