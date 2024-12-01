const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const Review = require("../models/Review");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../config/multerConfig");

// Create book
router.post("/", auth, admin, upload.single("image"), async (req, res) => {
  const { title, author, description, price, genre } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const newBook = new Book({
      title,
      author,
      description,
      price,
      genre,
      image,
    });
    const book = await newBook.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update book
router.put("/:id", auth, admin, upload.single("image"), async (req, res) => {
  const { title, author, description, price, genre } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    let book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: "Book not found" });

    const updatedFields = { title, author, description, price, genre };
    if (image) updatedFields.image = image;

    book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );
    res.json(book);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Read books
router.get("/", async (req, res) => {
  const { search, sortBy, order, genre } = req.query;
  try {
    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } },
        ],
      };
    }
    if (genre) {
      query.genre = genre;
    }

    let sort = {};
    if (sortBy) {
      sort[sortBy] = order === "desc" ? -1 : 1;
    }

    const books = await Book.find(query).populate("genre").sort(sort);
    res.json(books);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Read book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("genre");
    if (!book) return res.status(404).json({ msg: "Book not found" });
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

    await Book.findByIdAndDelete(req.params.id);
    await Review.deleteMany({ book: req.params.id });
    res.json({ msg: "Book and associated reviews removed" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
