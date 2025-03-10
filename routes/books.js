const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Book = require('../models/Book');

// @route   GET /api/books
// @desc    Get all books (filtered by subscription level)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get user to check subscription level
    const user = await User.findById(req.user.id);
    const subscriptionLevel = user.subscription;
    
    // Filter books based on user subscription level
    let query = {};
    if (subscriptionLevel === 'free') {
      query.accessLevel = 'free';
    } else if (subscriptionLevel === 'basic') {
      query.accessLevel = { $in: ['free', 'basic'] };
    }
    // Premium users can access all books
    
    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/books/:id
// @desc    Get book by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    
    // Check if user has access to this book
    const user = await User.findById(req.user.id);
    const subscriptionLevel = user.subscription;
    
    if (book.accessLevel === 'basic' && subscriptionLevel === 'free') {
      return res.status(403).json({ msg: 'Upgrade subscription to access this book' });
    }
    
    if (book.accessLevel === 'premium' && subscriptionLevel !== 'premium') {
      return res.status(403).json({ msg: 'Upgrade subscription to access this book' });
    }
    
    res.json(book);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Book not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/books
// @desc    Create a book (admin only)
// @access  Private/Admin
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const { title, author, description, accessLevel, coverImage } = req.body;
    
    // Create new book
    const newBook = new Book({
      title,
      author,
      description,
      accessLevel,
      coverImage
    });
    
    const book = await newBook.save();
    
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/books/:id
// @desc    Update a book (admin only)
// @access  Private/Admin
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    const { title, author, description, accessLevel, coverImage } = req.body;
    
    // Find the book
    let book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    
    // Update fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (description) book.description = description;
    if (accessLevel) book.accessLevel = accessLevel;
    if (coverImage) book.coverImage = coverImage;
    
    await book.save();
    
    res.json(book);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Book not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book (admin only)
// @access  Private/Admin
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    
    // Find the book
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ msg: 'Book not found' });
    }
    
    await book.remove();
    
    res.json({ msg: 'Book removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Book not found' });
    }
    res.status(500).send('Server error');
  }
});

// Fix missing User import
const User = require('../models/User');

module.exports = router;