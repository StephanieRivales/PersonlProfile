require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
console.log("DNS:", dns.getServers());

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "https://personl-profile.vercel.app"
}));
app.use(express.json());

console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000, // fail fast instead of hanging
})
  .then(() => console.log("✓ Connected to MongoDB Atlas"))
  .catch(err => console.error("✗ MongoDB connection error:", err.message));

// Log connection state changes as they happen
mongoose.connection.on("connected", () => console.log("Mongoose: connected"));
mongoose.connection.on("disconnected", () => console.log("Mongoose: disconnected"));
mongoose.connection.on("error", (err) => console.error("Mongoose connection error:", err.message));

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
  console.log("Incoming /contact body:", req.body);
  console.log("Mongoose readyState at time of request:", mongoose.connection.readyState); 
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting

  try {
    const newMessage = new Message(req.body);
    const saved = await newMessage.save();
    console.log("✓ Saved message:", saved._id);
    res.json({ success: true, msg: "Message saved successfully!" });
  } catch (err) {
    console.error("✗ Save error name:", err.name);
    console.error("✗ Save error message:", err.message);
    console.error("✗ Full error:", err);
    res.status(500).json({ success: false, msg: "Error saving message.", error: err.message });
  }
});

app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ date: -1 });
    res.json(messages);
  } catch (err) {
    console.error("Fetch error:", err.message);
    res.status(500).json({ success: false, msg: "Error fetching messages." });
  }
});

app.delete("/messages/:id", async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, msg: "Message not found." });
    }
    res.json({ success: true, msg: "Message deleted successfully!" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ success: false, msg: "Error deleting message." });
  }
});
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});