const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: 'default-cover.jpg'
  },
  accessLevel: {
    type: String,
    enum: ['free', 'basic', 'premium'],
    default: 'free'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Book', BookSchema);