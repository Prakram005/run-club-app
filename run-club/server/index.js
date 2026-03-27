const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dns = require("dns");
require("dotenv").config();

const User = require("./models/User");
const Event = require("./models/event");
const auth = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;
const DNS_SERVERS = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

let dbReady = false;



app.use(express.json());

app.use(
  cors({
    origin: "https://run-club-app.vercel.app",
    credentials: true
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
      "Fix this by either using a different network/DNS, or replacing the `mongodb+srv://...` URI with the standard `mongodb://...` Atlas connection string."
    ].join(" ");
  }

  if (error.name === "MongooseServerSelectionError") {
    return "MongoDB server selection failed. Check Atlas IP access, database user credentials, and that the cluster is running.";
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

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000
  });

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

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
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

    const token = jwt.sign({ id: user._id }, "secret123", { expiresIn: "1h" });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    return res.send(events);
  } catch (error) {
    return res.status(500).send(error.message || "Failed to fetch events");
  }
});

app.post("/create-event", auth, async (req, res) => {
  try {
    const title = req.body.title?.trim();
    const location = req.body.location?.trim();
    const description = req.body.description?.trim();
    const date = req.body.date;
    const maxParticipants = Number.parseInt(req.body.maxParticipants, 10) || 20;

    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }

    const event = new Event({
      title,
      location,
      date,
      description,
      maxParticipants,
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
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const userId = req.user.id;

    if (!event.participants.includes(userId)) {
      event.participants.push(userId);
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

    const userId = req.user.id;
    event.participants = event.participants.filter((id) => id !== userId);

    await event.save();
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to leave event" });
  }
});

app.get("/my-events", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const events = await Event.find({ participants: userId });

    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Failed to fetch user events" });
  }
});

async function startServer() {
  app.listen(PORT, () => {
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
