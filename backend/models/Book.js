const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
  },
  year: {
    type: Number,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  status: {
    type: String,
    enum: ['Available', 'Issued'],
    default: 'Available',
  },
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
