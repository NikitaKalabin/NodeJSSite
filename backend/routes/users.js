const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const debug = require("debug")("app:users");
const auth = require("../middleware/auth");

// Register
router.post("/register", async (req, res) => {
  const { username, password, isAdmin } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) {
      debug("User already exists: %s", username);
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ username, password, isAdmin });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    debug("User registered successfully: %s", username);
    res.status(201).json({ msg: "User registered" });
  } catch (err) {
    debug("Server error during registration: %O", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      debug("Invalid credentials: %s", username);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      debug("Invalid credentials: %s", username);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.SESSION_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) {
          debug("Error signing token: %O", err);
          throw err;
        }
        debug("User logged in successfully: %s", username);
        res.json({ token, user });
      }
    );
  } catch (err) {
    debug("Server error during login: %O", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    debug("Google OAuth callback received");
    res.redirect("/dashboard");
  }
);

// Get current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    debug("Server error during fetching user: %O", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    debug("Server error during fetching users: %O", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get user by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    debug("Server error during fetching user: %O", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update user
router.put("/:id", auth, async (req, res) => {
  const { username, password, googleId, isAdmin } = req.body;
  try {
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const updatedUser = { username, googleId, isAdmin };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedUser.password = await bcrypt.hash(password, salt);
    }

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updatedUser },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    debug("Server error during updating user: %O", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete user
router.delete("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    await User.findByIdAndRemove(req.params.id);
    res.json({ msg: "User removed" });
  } catch (err) {
    debug("Server error during deleting user: %O", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
