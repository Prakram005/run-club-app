const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: String,
  location: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  date: String,
  description: String,
  maxParticipants: {
    type: Number,
    default: 20
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
});

module.exports = mongoose.model("Event", eventSchema);
