const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const debug = require("debug")("app:users");

// Register
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) {
      debug("User already exists: %s", username);
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ username, password });
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
        res.json({ token });
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

module.exports = router;
