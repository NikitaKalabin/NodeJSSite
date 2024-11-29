const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const auth = require("../middleware/auth");

// Create book
router.post("/", auth, async (req, res) => {
  const { title, author, description, price } = req.body;
  try {
    const newBook = new Book({ title, author, description, price });
    const book = await newBook.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Read books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update book
router.put("/:id", auth, async (req, res) => {
  const { title, author, description, price } = req.body;
  try {
    let book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: "Book not found" });

    book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: { title, author, description, price } },
      { new: true }
    );
    res.json(book);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete book
router.delete("/:id", auth, async (req, res) => {
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
