const express = require('express');
const { check, query, param } = require('express-validator');
const validate = require('../middleware/validate');
const {
  createBook,
  getBooks,
  getBookById
} = require('../controllers/bookController');
const auth = require('../middleware/auth');
const Book = require('../models/Book');

const router = express.Router();

// Add a new book (auth required)
router.post(
  '/',
  auth,
  [
    check('title', 'Title is required').notEmpty(),
    check('author', 'Author is required').notEmpty(),
    check('genre', 'Genre must be a string').optional().isString(),
  ],
  validate,
  createBook
);

// Get all books (pagination + optional filters)
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1'),
    query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be >= 1'),
    query('author').optional().isString().withMessage('Author filter must be a string'),
    query('genre').optional().isString().withMessage('Genre filter must be a string'),
  ],
  validate,
  getBooks
);

// Search books by title or author (partial, case-insensitive)
router.get(
  '/search',
  [
    query('q', 'Search query "q" is required').notEmpty()
  ],
  validate,
  async (req, res) => {
    try {
      const { q } = req.query;
      const regex = new RegExp(q, 'i');
      const results = await Book.find({
        $or: [
          { title:  regex },
          { author: regex }
        ]
      });
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error.' });
    }
  }
);

// Get single book by ID (with avg-rating & paginated reviews)
router.get(
  '/:id',
  [
    param('id', 'Invalid book ID').isMongoId()
  ],
  validate,
  getBookById
);

module.exports = router;
