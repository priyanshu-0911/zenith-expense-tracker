// server.js
require('dotenv').config();
require('./config/db');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// CORRECT ORDER: Middleware to parse JSON must come BEFORE routes
app.use(express.json());

// Define API routes here
app.use('/api/auth', require('./routes/auth'));
app.use('/api/receipts', require('./routes/receipts'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/recurring', require('./routes/recurring'));

// This is just a test route, it's fine here
app.get('/', (req, res) => {
  res.send('Smart Expense Tracker Backend is Running!');
});

// REMOVED the duplicate app.use('/api/auth'...) from down here

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access it at: http://localhost:${PORT}`);
});

// --- Use API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/receipts', require('./routes/receipts'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/users', require('./routes/users'));
app.use('/api/budgets', require('./routes/budgets')); // ADD THIS LINE