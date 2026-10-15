const mongoose = require("mongoose");

const VenueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true
  },
  address: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  capacity: {
    type: Number
  },
  image: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Venue", VenueSchema);
