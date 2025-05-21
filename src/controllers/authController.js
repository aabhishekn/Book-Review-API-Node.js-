const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Register new user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // validation
    if (!username || !password) {
      const err = new Error('Please provide username and password.');
      err.statusCode = 400;
      throw err;
    }

    // create user
    await User.create({ username, password });
    res.status(201).json({ message: 'User registered.' });

  } catch (err) {
    // handle duplicate username
    if (err.code === 11000) {
      const dup = new Error('Username already exists.');
      dup.statusCode = 409;
      return next(dup);
    }
    // forward all other errors
    next(err);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // validation
    if (!username || !password) {
      const err = new Error('Please provide username and password.');
      err.statusCode = 400;
      throw err;
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      const authErr = new Error('Invalid credentials.');
      authErr.statusCode = 401;
      throw authErr;
    }

    // generate token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({ token });

  } catch (err) {
    next(err);
  }
};
