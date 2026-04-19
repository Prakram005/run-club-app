const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event"
    },
    type: {
      type: String,
      enum: ["event_joined", "event_created", "event_reminder", "event_updated", "participant_joined"],
      required: true
    },
    title: String,
    message: String,
    read: {
      type: Boolean,
      default: false
    },
    relatedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
