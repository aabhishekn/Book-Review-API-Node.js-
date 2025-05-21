const Book   = require('../models/Book');
const Review = require('../models/Review');

// @desc    Add a new book
// @route   POST /api/books
// @access  Private
exports.createBook = async (req, res, next) => {
  try {
    const { title, author, genre } = req.body;

    // validation
    if (!title || !author) {
      const err = new Error('Title and author are required.');
      err.statusCode = 400;
      throw err;
    }

    const book = await Book.create({ title, author, genre });
    res.status(201).json(book);

  } catch (err) {
    next(err);
  }
};

// @desc    Get all books (pagination + optional filters)
// @route   GET /api/books
// @access  Public
exports.getBooks = async (req, res, next) => {
  try {
    let { page = 1, limit = 10, author, genre } = req.query;
    page  = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const filter = {};
    if (author) filter.author = new RegExp(author, 'i');
    if (genre)  filter.genre  = genre;

    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(books);

  } catch (err) {
    next(err);
  }
};

// @desc    Get single book + avg rating + paginated reviews
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      const err = new Error('Book not found.');
      err.statusCode = 404;
      throw err;
    }

    let { page = 1, limit = 5 } = req.query;
    page  = parseInt(page, 10);
    limit = parseInt(limit, 10);

    const reviews = await Review.find({ book: book._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('user', 'username');

    const agg = await Review.aggregate([
      { $match: { book: book._id } },
      { $group: { _id: null, averageRating: { $avg: '$rating' } } }
    ]);
    const averageRating = agg[0]?.averageRating || 0;

    res.json({
      book,
      averageRating,
      reviews
    });

  } catch (err) {
    next(err);
  }
};
