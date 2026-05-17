const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  issueId: {
    type: String,
    required: true,
    unique: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Issued', 'Returned'],
    default: 'Issued',
  },
  fine: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
