require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
console.log("DNS:", dns.getServers());

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✓ Connected to MongoDB Atlas"))
  .catch(err => console.error("✗ MongoDB connection error:", err));

/* -------------------- MESSAGE FEATURE -------------------- */
const messageSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  date: { type: Date, default: Date.now }
});
const Message = mongoose.model("Message", messageSchema);

// Save message
app.post("/contact", async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();
    res.json({ success: true, msg: "Message saved successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error saving message." });
  }
});

// Get all messages
app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false, msg: "Error fetching messages." });
  }
});

/* -------------------- SERVER -------------------- */
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
