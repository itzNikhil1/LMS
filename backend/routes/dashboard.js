const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const Student = require('../models/Student');
const Transaction = require('../models/Transaction');

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalStudents = await Student.countDocuments();
    const booksIssued = await Transaction.countDocuments({ status: 'Issued' });
    
    // Calculate total fine collected
    const returnedTransactions = await Transaction.find({ status: 'Returned' });
    const totalFineCollected = returnedTransactions.reduce((acc, curr) => acc + (curr.fine || 0), 0);

    res.json({
      totalBooks,
      totalStudents,
      booksIssued,
      totalFineCollected
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
