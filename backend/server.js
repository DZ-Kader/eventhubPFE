const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "*"
  })
);
app.use(express.json());

// Routes mounting
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/cities", require("./routes/cities"));
app.use("/api/venues", require("./routes/venues"));
app.use("/api/registrations", require("./routes/registrations"));
app.use("/api/favorites", require("./routes/favorites"));
app.use("/api/admin", require("./routes/admin"));

app.get("/", (req, res) => {
  res.send("Eventoria API Running");
});

app.get("/api/seed", async (req, res) => {
  try {
    const seeder = require("./seed/seeder");
    if (typeof seeder === "function") {
      await seeder();
    }
    res.json({ success: true, message: "Database seeded successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Port fallback
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});