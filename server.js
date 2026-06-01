const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// 1. MIDDLEWARES
app.use(cors());
app.use(express.json());

// 2. CONNECT TO MONGO_DB ATLAS VIA SECURE ENVIRONMENT VARIABLES
const MONGO_URI = process.env.MONGO_URI; 

if (!MONGO_URI) {
  console.error("CRITICAL ERROR: MONGO_URI environment variable is missing!");
} else {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB Atlas Cloud.'))
    .catch((err) => console.error('Database connection failure:', err));
}

// 3. DEFINE DATA SCHEMA MODELS
const GuestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  status: { type: String, required: true, enum: ['yes', 'no'] },
  menu: { type: String, required: false } // Stripped out for non-attending guests
});

const RsvpSchema = new mongoose.Schema({
  guests: [GuestSchema],
  message: { type: String, trim: true, default: "" },
  submittedAt: { type: Date, default: Date.now }
});

const Rsvp = mongoose.model('Rsvp', RsvpSchema);

// 4. API ENDPOINTS
// Light heartbeat endpoint to keep the server awake using cron-jobs
app.get('/api/ping', (req, res) => {
  res.status(200).send('Alive');
});

// The principal RSVP submission handler
app.post('/api/rsvp', async (req, res) => {
  try {
    const { message, guests } = req.body;

    if (!guests || !Array.isArray(guests) || guests.length === 0) {
      return res.status(400).json({ success: false, error: "Missing guest records." });
    }

    // Backend validation guardrail
    for (const guest of guests) {
      if (!guest.name || !guest.name.trim() || !guest.status) {
        return res.status(400).json({ success: false, error: "Each guest requires a name and status." });
      }
    }

    const newRsvp = new Rsvp({ guests, message });
    await newRsvp.save();

    return res.status(200).json({ success: true, message: "RSVP saved successfully!" });
  } catch (error) {
    console.error("Database save execution error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error." });
  }
});

// 5. SERVE FRONTEND STATIC FILES (For unified Render deployment)
// Compares and looks for files inside your client build folder (change 'build' to 'dist' if using Vite)
app.use(express.static(path.join(__dirname, 'client/build')));

// Fallback rule: routes anything that isn't an API endpoint back to React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// 6. START SERVER ENGINE
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running smoothly on port ${PORT}`));