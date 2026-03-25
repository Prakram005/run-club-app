const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const auth = require("../middleware/auth");

// CREATE event
router.post("/", auth, async (req, res) => {
  try {
    console.log("USER:", req.user); // debug

    const { title, location, date } = req.body;

    const newEvent = new Event({
      title,
      location,
      date,
      createdBy: req.user.id,
      participants: []
    });

    await newEvent.save();
    res.json(newEvent);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all events (global view)
router.get("/", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// JOIN event
router.post("/:id/join", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event.participants.includes(req.user.id)) {
      event.participants.push(req.user.id);
      await event.save();
    }

    res.json(event);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;