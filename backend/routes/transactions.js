const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const Student = require('../models/Student');
const mongoose = require('mongoose');

// @route   GET /api/transactions
// @desc    Get all transactions (for reports)
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('studentId', 'studentId name')
      .populate('bookId', 'bookId title')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/transactions/issue
// @desc    Issue a book
router.post('/issue', async (req, res) => {
  const { studentIdStr, bookIdStr, issueDate, dueDate } = req.body;

  try {
    // Find Student and Book by their custom IDs
    const student = await Student.findOne({ studentId: studentIdStr });
    const book = await Book.findOne({ bookId: bookIdStr });

    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.status === 'Issued') {
      return res.status(400).json({ message: 'Book is already issued' });
    }
    
    if (book.quantity <= 0) {
        return res.status(400).json({ message: 'Book is out of stock' });
    }

    // Generate unique issue ID
    const issueId = 'ISSUE' + Date.now();

    const transaction = new Transaction({
      issueId,
      studentId: student._id,
      bookId: book._id,
      issueDate,
      dueDate,
    });

    await transaction.save();

    // Update book status and quantity
    book.status = book.quantity === 1 ? 'Issued' : 'Available';
    book.quantity -= 1;
    await book.save();

    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/transactions/return
// @desc    Return a book
router.post('/return', async (req, res) => {
  const { issueId, returnDate } = req.body;

  try {
    const transaction = await Transaction.findOne({ issueId });

    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    if (transaction.status === 'Returned') return res.status(400).json({ message: 'Book already returned' });

    // Calculate fine (if any). Example: $1 per day after due date
    const dDueDate = new Date(transaction.dueDate);
    const dReturnDate = new Date(returnDate || Date.now());
    
    let fine = 0;
    if (dReturnDate > dDueDate) {
      const diffTime = Math.abs(dReturnDate - dDueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      fine = diffDays * 1; // Assuming $1 per day
    }

    transaction.status = 'Returned';
    transaction.returnDate = dReturnDate;
    transaction.fine = fine;

    await transaction.save();

    // Update book status and quantity
    const book = await Book.findById(transaction.bookId);
    if (book) {
      book.status = 'Available';
      book.quantity += 1;
      await book.save();
    }

    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
