require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
console.log("DNS:", dns.getServers());

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✓ Connected to MongoDB Atlas"))
  .catch(err => console.error("✗ MongoDB connection error:", err));
// Schema
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", messageSchema);

// Route
app.post("/contact", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.json({ success: true, msg: "Message saved successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error saving message." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
