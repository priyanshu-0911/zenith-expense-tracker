// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors'); // 1. IMPORT CORS
const cronService = require('./services/cronService');
require('./config/db'); // This line connects to your database

const app = express();
const PORT = process.env.PORT || 5000;

// --- THIS IS THE CRITICAL FIX ---
// 2. CONFIGURE AND USE CORS
// This tells your backend to accept requests from your live frontend URL.
const corsOptions = {
  origin: 'https://zenith-expense-tracker-eg5q.vercel.app', // Your Vercel URL
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// --- END OF FIX ---

// Middleware to parse incoming JSON
app.use(express.json());

// --- Define API Routes (only once) ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/receipts', require('./routes/receipts'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/recurring', require('./routes/recurring'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/funds', require('./routes/funds'));
app.use('/api/budgets', require('./routes/budgets'));

// A simple root route to confirm the server is running
app.get('/', (req, res) => {
  res.send('Zenith Expense Tracker Backend is Running!');
});

// Start the server and the cron service
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  cronService.start();
});