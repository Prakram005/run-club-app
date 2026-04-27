const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dns = require("dns");
require("dotenv").config();

const User = require("./models/User");
const Event = require("./models/event");
const Notification = require("./models/Notification");
const auth = require("./middleware/auth");

const chatMessageSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, maxlength: 1000 }
  },
  { timestamps: true }
);

const ChatMessage = mongoose.models.ChatMessage || mongoose.model("ChatMessage", chatMessageSchema);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const DNS_SERVERS = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
  .split(",")
  .map((serverName) => serverName.trim())
  .filter(Boolean);
const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS ||
  "http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,https://run-club-app.vercel.app")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

let dbReady = false;

function parseCoordinates(input) {
  const latitude = Number.parseFloat(input?.latitude);
  const longitude = Number.parseFloat(input?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return undefined;
  }

  return { latitude, longitude };
}

function isAllowedOrigin(origin) {
  return ALLOWED_ORIGINS.includes(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
}

const io = new Server(server, {
  cors: {
    origin(origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("No token"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");
    socket.userId = decoded.id;
    socket.userName = decoded.name || "Runner";
    return next();
  } catch (error) {
    return next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  socket.on("join-room", (eventId) => {
    socket.join(eventId);
  });

  socket.on("leave-room", (eventId) => {
    socket.leave(eventId);
  });

  socket.on("send-message", ({ room, message }) => {
    socket.to(room).emit("receive-message", message);
  });

  socket.on("typing", ({ room, name }) => {
    socket.to(room).emit("typing", { name });
  });
});

app.use(express.json());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  })
);

function explainMongoError(error) {
  if (!error) {
    return "Unknown MongoDB connection error.";
  }

  if (error.code === "ECONNREFUSED" && error.syscall === "querySrv") {
    return [
      "MongoDB Atlas SRV lookup failed.",
      "Your current network or DNS resolver is refusing SRV record queries for the Atlas hostname.",
      "Fix this by either using a different network or replacing mongodb+srv with a standard mongodb connection string."
    ].join(" ");
  }

  if (error.name === "MongooseServerSelectionError") {
    return "MongoDB server selection failed. Check Atlas IP access, credentials, and cluster status.";
  }

  return error.message || String(error);
}

async function connectToDatabase() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGO_URI in run-club/server/.env");
  }

  if (mongoUri.startsWith("mongodb+srv://") && DNS_SERVERS.length > 0) {
    dns.setServers(DNS_SERVERS);
    console.log(`Using DNS servers for MongoDB SRV lookup: ${DNS_SERVERS.join(", ")}`);
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
  dbReady = true;
  console.log("MongoDB connected");
}

function requireDatabase(req, res, next) {
  if (dbReady) {
    return next();
  }

  return res.status(503).json({
    message: "Database is not connected. Check the server console for MongoDB connection details."
  });
}

app.get("/", (req, res) => {
  res.send("Run Club API is running");
});

app.use(requireDatabase);

app.post("/register", async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to register user" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET || "secret123", {
      expiresIn: "7d"
    });

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/events", async (req, res) => {
  try {
    const events = await Event.find()
      .populate("participants", "name")
      .populate("reviews.user", "name")
      .lean();
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch events" });
  }
});

app.post("/create-event", auth, async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const location = req.body.location?.trim();
    const description = req.body.description?.trim();
    const date = req.body.date;
    const maxParticipants = Number.parseInt(req.body.maxParticipants, 10) || 20;
    const coordinates = parseCoordinates(req.body.coordinates);
    const difficulty = req.body.difficulty || "intermediate";
    const terrain = req.body.terrain || "road";
    const pace = req.body.pace?.trim();
    const distance = req.body.distance ? Number.parseFloat(req.body.distance) : undefined;
    const tags = Array.isArray(req.body.tags) ? req.body.tags : [];

    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }

    const event = new Event({
      title,
      location,
      coordinates,
      date,
      description,
      maxParticipants,
      difficulty,
      terrain,
      pace,
      distance,
      tags,
      createdBy: req.user.id,
      participants: []
    });

    await event.save();
    return res.status(201).json(event);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to create event" });
  }
});

app.post("/join-event/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const isNewParticipant = !event.participants.map((entry) => String(entry)).includes(String(req.user.id));
    
    if (isNewParticipant) {
      event.participants.push(req.user.id);

      // Create notification for event creator
      if (String(event.createdBy._id) !== String(req.user.id)) {
        const notification = new Notification({
          userId: event.createdBy._id,
          eventId: event._id,
          type: "participant_joined",
          title: `New participant for "${event.title}"`,
          message: `Someone joined your event!`,
          relatedUserId: req.user.id
        });
        await notification.save();
      }
    }

    await event.save();
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to join event" });
  }
});

app.post("/leave-event/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.participants = event.participants.filter((entry) => String(entry) !== String(req.user.id));
    await event.save();
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to leave event" });
  }
});

app.post("/events/:id/reviews", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (new Date(event.date) > new Date()) {
      return res.status(400).json({ message: "Reviews open after the run is completed" });
    }

    if (String(event.createdBy) === String(req.user.id)) {
      return res.status(403).json({ message: "Organisers cannot review their own run" });
    }

    const joined = event.participants.some((entry) => String(entry) === String(req.user.id));

    if (!joined) {
      return res.status(403).json({ message: "Only participants can review this run" });
    }

    const rating = Number.parseInt(req.body.rating, 10);
    const comment = req.body.comment?.trim() || "";

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (comment.length > 700) {
      return res.status(400).json({ message: "Review comment must be 700 characters or less" });
    }

    const existingReview = event.reviews.find((review) => String(review.user) === String(req.user.id));

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.updatedAt = new Date();
    } else {
      event.reviews.push({
        user: req.user.id,
        rating,
        comment
      });
    }

    await event.save();
    const updatedEvent = await Event.findById(req.params.id)
      .populate("participants", "name")
      .populate("reviews.user", "name")
      .lean();

    return res.status(existingReview ? 200 : 201).json(updatedEvent);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to save review" });
  }
});

app.delete("/events/:id/reviews/:reviewId", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const review = event.reviews.id(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const ownsReview = String(review.user) === String(req.user.id);
    const ownsEvent = String(event.createdBy) === String(req.user.id);

    if (!ownsReview && !ownsEvent) {
      return res.status(403).json({ message: "Not authorized" });
    }

    review.deleteOne();
    await event.save();

    const updatedEvent = await Event.findById(req.params.id)
      .populate("participants", "name")
      .populate("reviews.user", "name")
      .lean();

    return res.json(updatedEvent);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to delete review" });
  }
});

app.get("/my-events", auth, async (req, res) => {
  try {
    const events = await Event.find({ participants: req.user.id });
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch user events" });
  }
});

app.get("/my-created-events", auth, async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id }).sort({ date: -1 });
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch created events" });
  }
});

app.put("/events/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (String(event.createdBy) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, date, location, description, maxParticipants } = req.body;
    const coordinates = parseCoordinates(req.body.coordinates);

    if (title) {
      event.title = title.trim();
    }

    if (date) {
      event.date = date;
    }

    if (location !== undefined) {
      event.location = location.trim();
      event.coordinates = coordinates;
    }

    if (description !== undefined) {
      event.description = description.trim();
    }

    if (maxParticipants) {
      event.maxParticipants = Number(maxParticipants) || 20;
    }

    await event.save();
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to update event" });
  }
});

app.delete("/events/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (String(event.createdBy) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await event.deleteOne();
    await ChatMessage.deleteMany({ eventId: req.params.id });
    return res.json({ message: "Event deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to delete event" });
  }
});

app.get("/chat/:eventId", auth, async (req, res) => {
  try {
    const messages = await ChatMessage.find({ eventId: req.params.eventId })
      .populate("sender", "name")
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();

    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch messages" });
  }
});

app.post("/chat/:eventId", auth, async (req, res) => {
  try {
    const text = req.body.text?.trim();

    if (!text) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    if (text.length > 1000) {
      return res.status(400).json({ message: "Message too long" });
    }

    const message = new ChatMessage({
      eventId: req.params.eventId,
      sender: req.user.id,
      text
    });

    await message.save();

    const populatedMessage = await ChatMessage.findById(message._id).populate("sender", "name").lean();
    return res.status(201).json(populatedMessage);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to send message" });
  }
});

app.get("/leaderboard", async (req, res) => {
  try {
    const organised = await Event.aggregate([
      { $group: { _id: "$createdBy", organised: { $sum: 1 } } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      { $project: { userId: "$_id", name: { $ifNull: ["$user.name", "Runner"] }, organised: 1 } }
    ]);

    const joined = await Event.aggregate([
      { $unwind: "$participants" },
      { $group: { _id: "$participants", joined: { $sum: 1 } } }
    ]);

    const joinedMap = {};
    joined.forEach((entry) => {
      joinedMap[String(entry._id)] = entry.joined;
    });

    return res.json(
      organised.map((entry) => ({
        userId: String(entry.userId),
        name: entry.name,
        organised: entry.organised,
        joined: joinedMap[String(entry.userId)] || 0
      }))
    );
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch leaderboard" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ data: user });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch user" });
  }
});

app.get("/notifications", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("relatedUserId", "name")
      .limit(50);

    return res.json(notifications);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch notifications" });
  }
});

app.post("/notifications/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (String(notification.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    notification.read = true;
    await notification.save();

    return res.json(notification);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to update notification" });
  }
});

app.post("/notifications/read-all", auth, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id }, { read: true });

    return res.json({ message: "All notifications marked as read" });
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to update notifications" });
  }
});

async function startServer() {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  try {
    await connectToDatabase();
  } catch (error) {
    dbReady = false;
    console.error("MongoDB connection failed:");
    console.error(explainMongoError(error));
  }
}

startServer();
