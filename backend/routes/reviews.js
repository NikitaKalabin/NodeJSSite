const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const auth = require("../middleware/auth");

// Create review
router.post("/", auth, async (req, res) => {
  const { book, rating, comment } = req.body;
  try {
    const newReview = new Review({ user: req.user.id, book, rating, comment });
    const review = await newReview.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Read reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().populate("user").populate("book");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update review
router.put("/:id", auth, async (req, res) => {
  const { rating, comment } = req.body;
  try {
    let review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ msg: "Review not found" });

    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    review = await Review.findByIdAndUpdate(
      req.params.id,
      { $set: { rating, comment } },
      { new: true }
    );
    res.json(review);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete review
router.delete("/:id", auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ msg: "Review not found" });

    if (review.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await Review.findByIdAndRemove(req.params.id);
    res.json({ msg: "Review removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
