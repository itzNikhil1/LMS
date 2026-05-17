const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// @route   GET /api/books
// @desc    Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/books
// @desc    Add a new book
router.post('/', async (req, res) => {
  const { bookId, title, author, category, publisher, year, quantity } = req.body;

  try {
    let book = await Book.findOne({ bookId });
    if (book) {
      return res.status(400).json({ message: 'Book with this ID already exists' });
    }

    book = new Book({
      bookId, title, author, category, publisher, year, quantity
    });

    await book.save();
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/books/:id
// @desc    Update a book
router.put('/:id', async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    book = await Book.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Book removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
