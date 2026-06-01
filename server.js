const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Rsvp = require('./models/Rsvp'); // Import our new schema model

const app = express();

app.use(cors());
app.use(express.json());

// 1. CONNECT TO MONGO_DB (Local or MongoDB Atlas Cloud URI string)
const MONGO_URI = 'mongodb://127.0.0.1:27017/wedding_db'; 

mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch((err) => console.error('Database connection breakdown error:', err));

// 2. THE CHOSEN RSVP POST ROUTE
app.post('/api/rsvp', async (req, res) => {
  try {
    const { message, guests } = req.body;

    // Strict validation loop checklist check
    if (!guests || !Array.isArray(guests) || guests.length === 0) {
      return res.status(400).json({ success: false, error: "Missing guest data layout shape." });
    }

    for (const guest of guests) {
      if (!guest.name || !guest.name.trim() || !guest.status) {
        return res.status(400).json({ success: false, error: "All guests require a name and valid status choice." });
      }
    }

    // CREATE AND WRITE DIRECTLY TO THE DATABASE
    const newRsvp = new Rsvp({
      guests,
      message
    });

    await newRsvp.save(); // Document is permanently indexed here

    return res.status(200).json({ success: true, message: "Response successfully logged!" });

  } catch (error) {
    console.error("Database save transaction error:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error writing records." });
  }
});

app.listen(5000, () => console.log('Server runner operational on port 5000'));

app.get('/api/ping', (req, res) => {
  res.status(200).send('Alive');
});