const express = require("express");
const router = express.Router();
const Genre = require("../models/Genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Create genre
router.post("/", auth, admin, async (req, res) => {
  const { name, description } = req.body;
  try {
    const newGenre = new Genre({ name, description });
    const genre = await newGenre.save();
    res.json(genre);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Read genres
router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update genre
router.put("/:id", auth, admin, async (req, res) => {
  const { name, description } = req.body;
  try {
    let genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).json({ msg: "Genre not found" });

    genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { $set: { name, description } },
      { new: true }
    );
    res.json(genre);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete genre
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).json({ msg: "Genre not found" });

    await Genre.findByIdAndRemove(req.params.id);
    res.json({ msg: "Genre removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
