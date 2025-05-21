const Review = require('../models/Review');

// @desc    Add a review to a book
// @route   POST /api/books/:id/reviews
// @access  Private
exports.addReview = async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const userId = req.user._id;
    const { rating, comment } = req.body;

    // validation
    if (rating == null) {
      const err = new Error('Rating is required.');
      err.statusCode = 400;
      throw err;
    }

    // one review per user per book
    const exists = await Review.findOne({ book: bookId, user: userId });
    if (exists) {
      const err = new Error('You have already reviewed this book.');
      err.statusCode = 400;
      throw err;
    }

    const review = await Review.create({
      book:    bookId,
      user:    userId,
      rating,
      comment
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a user’s own review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const userId   = req.user._id;
    const updates  = req.body;

    const review = await Review.findOneAndUpdate(
      { _id: reviewId, user: userId },
      updates,
      { new: true }
    );

    if (!review) {
      const err = new Error('Review not found or not yours.');
      err.statusCode = 404;
      throw err;
    }

    res.json(review);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a user’s own review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res, next) => {
  try {
    const reviewId = req.params.id;
    const userId   = req.user._id;

    const result = await Review.deleteOne({ _id: reviewId, user: userId });
    if (result.deletedCount === 0) {
      const err = new Error('Review not found or not yours.');
      err.statusCode = 404;
      throw err;
    }

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
