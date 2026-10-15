const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  icon: {
    type: String,
    default: "calendar"
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Category", CategorySchema);
