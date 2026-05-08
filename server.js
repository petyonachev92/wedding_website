const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Temporary in-memory storage (clears if server restarts)
const responses = [];

app.post('/api/rsvp', (req, res) => {
    const { name, status, guests } = req.body;
    
    if (!name || !status) {
        return res.status(400).json({ error: "Please provide name and attendance status." });
    }

    const newRsvp = { name, status, guests, date: new Date() };
    responses.push(newRsvp);
    
    console.log("New RSVP Received:", newRsvp);
    res.status(200).json({ message: "Success! We can't wait to see you." });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));