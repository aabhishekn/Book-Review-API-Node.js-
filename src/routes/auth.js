const express = require('express');
const { signup, login } = require('../controllers/authController');
const { check } = require('express-validator');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/signup',
  [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  validate,
  signup
);

router.post(
  '/login',
  [
    check('username', 'Username is required').notEmpty(),
    check('password', 'Password is required').notEmpty()
  ],
  validate,
  login
);

module.exports = router;
