const express = require('express');
const {
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const { check, param } = require('express-validator');
const validate = require('../middleware/validate');

const router = express.Router();

// Submit a new review for a book
router.post(
  '/books/:id/reviews',
  auth,
  [
    param('id', 'Invalid book ID').isMongoId(),
    check('rating', 'Rating is required and must be an integer between 1 and 5')
      .isInt({ min: 1, max: 5 }),
    check('comment', 'Comment must be text')
      .optional()
      .isString()
  ],
  validate,
  addReview
);

// Update your own review
router.put(
  '/reviews/:id',
  auth,
  [
    param('id', 'Invalid review ID').isMongoId(),
    check('rating', 'Rating must be an integer between 1 and 5')
      .optional()
      .isInt({ min: 1, max: 5 }),
    check('comment', 'Comment must be text')
      .optional()
      .isString()
  ],
  validate,
  updateReview
);

// Delete your own review
router.delete(
  '/reviews/:id',
  auth,
  [
    param('id', 'Invalid review ID').isMongoId()
  ],
  validate,
  deleteReview
);

module.exports = router;
