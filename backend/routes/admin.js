const express = require("express");
const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/admin/dashboard & /api/admin/stats - Aggregated stats
const getAdminStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments({});
    const eventsCount = await Event.countDocuments({ status: "published" });
    const pendingCount = await Event.countDocuments({ status: "pending" });
    const registrationsCount = await Registration.countDocuments({});
    const totalEvents = await Event.countDocuments({});

    res.json({
      usersCount,
      eventsCount,
      pendingCount,
      registrationsCount,
      totalEvents,
      totalUsers: usersCount,
      pendingEvents: pendingCount,
      publishedEvents: eventsCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

router.get("/dashboard", authenticate, authorize("admin"), getAdminStats);
router.get("/stats", authenticate, authorize("admin"), getAdminStats);

// PUT /api/admin/events/:id/status - Approve or Reject an event directly from Admin Dashboard
router.put("/events/:id/status", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    if (!["published", "rejected", "pending", "draft"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.status = status;
    if (status === "rejected") {
      event.rejectionReason = rejectionReason || "Does not satisfy moderation guidelines";
    } else if (status === "published") {
      event.rejectionReason = "";
    }

    await event.save();

    res.json({ message: `Event status updated to ${status}`, event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users - List all users (Admin only)
router.get("/users", authenticate, authorize("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id/role - Update user role (Admin only)
router.put("/users/:id/role", authenticate, authorize("admin"), async (req, res) => {
  try {
    const { role } = req.body;
    if (!["user", "organizer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role value" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({ message: `Role updated to ${role}`, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
