// backend/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cronService = require('./services/cronService');
require('./config/db'); // This line connects to your database

const app = express();
const PORT = process.env.PORT || 5000;

// --- This is the new, more flexible CORS configuration ---
// List of all URLs that are allowed to make requests to your backend
const allowedOrigins = [
  'https://zenith-expense-tracker-eg5q.vercel.app', // Your production frontend
  'http://localhost:3000'                           // Your local development frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // This logic allows your frontend URLs and Vercel preview URLs
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware to parse incoming JSON
app.use(express.json());

// --- Define API Routes ---
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