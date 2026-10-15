const mongoose = require("mongoose");
const slugify = require("slugify");

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  },
  shortDescription: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true
  },
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue",
    required: true
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    default: "09:00"
  },
  endTime: {
    type: String,
    default: "17:00"
  },
  eventType: {
    type: String,
    enum: ["physical", "online", "hybrid"],
    default: "physical"
  },
  coverImage: {
    type: String,
    default: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"
  },
  registrationType: {
    type: String,
    enum: ["none", "internal", "external"],
    default: "internal"
  },
  externalRegistrationLink: {
    type: String,
    default: ""
  },
  capacity: {
    type: Number,
    default: 100
  },
  registrationDeadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ["draft", "pending", "published", "rejected", "completed", "cancelled"],
    default: "draft"
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  rejectionReason: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

// Autogenerate unique slug from title before validation
EventSchema.pre("save", async function () {
  if (this.isModified("title") || !this.slug) {
    let generatedSlug = slugify(this.title, { lower: true, strict: true });
    
    // Check uniqueness
    const slugRegEx = new RegExp(`^(${generatedSlug})(-\\d+)?$`, "i");
    const eventsWithSlug = await this.constructor.find({ slug: slugRegEx });
    if (eventsWithSlug.length > 0) {
      generatedSlug = `${generatedSlug}-${eventsWithSlug.length + 1}`;
    }
    this.slug = generatedSlug;
  }
});

module.exports = mongoose.model("Event", EventSchema);