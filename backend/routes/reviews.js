const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Service = require("../models/Service"); // Импортируем модель Service
const auth = require("../middleware/auth");

// Create review
router.post("/", auth, async (req, res) => {
  const { service, rating, comment } = req.body;
  try {
    const newReview = new Review({
      user: req.user.id,
      service,
      rating,
      comment,
    });
    const review = await newReview.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Read reviews
router.get("/", async (req, res) => {
  const { service } = req.query;
  try {
    const query = service ? { service } : {};
    const reviews = await Review.find(query)
      .populate("user")
      .populate("service");
    res.json(reviews);
  } catch (err) {
    console.error(err); // Выводим ошибку в консоль для отладки
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Update review
router.put("/:id", auth, async (req, res) => {
  const { rating, comment } = req.body;
  try {
    let review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ msg: "Review not found" });

    review.rating = rating;
    review.comment = comment;
    review.updatedAt = Date.now();

    review = await review.save();
    res.json(review);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Delete review
router.delete("/:id", auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ msg: "Review not found" });

    // Allow admins to delete any review
    if (review.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ msg: "Review removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
