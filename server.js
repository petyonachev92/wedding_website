const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. MIDDLEWARES (Must be loaded before routes to parse the incoming data)
app.use(cors());
app.use(express.json());

// 2. MONGOOSE CONNECTION
const MONGO_URI = process.env.MONGO_URI;
console.log("Attempting to connect to MongoDB with URI:", MONGO_URI);
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas.'))
  .catch((err) => console.error('Database error:', err));

// 3. SCHEMAS
const GuestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  status: { type: String, required: true },
  menu: { type: String, required: false }
});

const RsvpSchema = new mongoose.Schema({
  guests: [GuestSchema],
  message: { type: String, trim: true, default: "" },
  submittedAt: { type: Date, default: Date.now }
});

const Rsvp = mongoose.model('Rsvp', RsvpSchema);

// 4. THE CORRECTED LISTENER (Matches your frontend root POST request)
app.post('/api/rsvp', async (req, res) => {
  try {
    const { message, guests } = req.body;

    if (!guests || !Array.isArray(guests) || guests.length === 0) {
      return res.status(400).json({ success: false, error: "Missing guest data." });
    }

    // Save directly to your cloud collection
    const newRsvp = new Rsvp({ guests, message });
    await newRsvp.save();

    return res.status(200).json({ success: true, message: "Saved!" });
  } catch (error) {
    console.error("MongoDB Save Error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error." });
  }
});

// Keep-awake ping route
app.get('/api/ping', (req, res) => {
  res.status(200).send('Alive');
});

// 5. SERVE STATIC FILES
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server operating on port ${PORT}`));