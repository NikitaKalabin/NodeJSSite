const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Create book
router.post("/", auth, admin, async (req, res) => {
  const { title, author, description, price, genre } = req.body;
  try {
    const newBook = new Book({ title, author, description, price, genre });
    const book = await newBook.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Read books
router.get("/", auth, async (req, res) => {
  try {
    const books = await Book.find().populate("genre");
    res.json(books);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Read book by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("genre");
    if (!book) return res.status(404).json({ msg: "Book not found" });
    res.json(book);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update book
router.put("/:id", auth, admin, async (req, res) => {
  const { title, author, description, price, genre } = req.body;
  try {
    let book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: "Book not found" });

    book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: { title, author, description, price, genre } },
      { new: true }
    );
    res.json(book);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete book
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: "Book not found" });

    await Book.findByIdAndRemove(req.params.id);
    res.json({ msg: "Book removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
