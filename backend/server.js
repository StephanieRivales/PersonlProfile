require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://stephanie:steph123@personalprofile.s61jvxj.mongodb.net/personalprofile?retryWrites=true&w=majority")
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
