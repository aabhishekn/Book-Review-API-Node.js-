require('dotenv').config();
const express       = require('express');
const connectDB     = require('./config/db');
const authRoutes    = require('./routes/auth');
const bookRoutes    = require('./routes/books');
const reviewRoutes  = require('./routes/reviews');
const errorHandler  = require('./middleware/errorHandler');

const app = express();

// Connect to MongoDB
connectDB();

// Parse JSON bodies
app.use(express.json());

// Mount routes
app.use('/api/auth',  authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api',       reviewRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Book Review API is up and running!');
});

// Centralized error handler (catches thrown errors and calls next(err))
app.use(errorHandler);

// 404 handler (for any unmatched route)
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
