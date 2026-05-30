const mongoose = require('mongoose');

const GuestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['yes', 'no'] // Validates only binary choices
  },
  menu: {
    type: String,
    required: false // Optional, since non-attending guests have this stripped out
  }
});

const RsvpSchema = new mongoose.Schema({
  guests: [GuestSchema], // Nesting the array directly
  message: {
    type: String,
    trim: true,
    default: ""
  },
  submittedAt: {
    type: Date,
    default: Date.now // Automatically tracks when they clicked submit
  }
});

module.exports = mongoose.model('Rsvp', RsvpSchema);