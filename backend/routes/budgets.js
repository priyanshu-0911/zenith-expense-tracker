// backend/routes/budgets.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../config/db');

// @route   POST /api/budgets
// @desc    Create a new budget
// @access  Private
router.post('/', auth, async (req, res) => {
  const { category, amount, month, year } = req.body;
  const user_id = req.user.id;

  // Robust validation
  const parsedAmount = parseFloat(amount);
  const parsedMonth = parseInt(month, 10);
  const parsedYear = parseInt(year, 10);

  if (!category || isNaN(parsedAmount) || parsedAmount <= 0 || isNaN(parsedMonth) || isNaN(parsedYear)) {
    return res.status(400).json({ msg: 'Please provide valid data for all fields.' });
  }

  try {
    const newBudget = await pool.query(
      'INSERT INTO budgets (user_id, category, amount, month, year) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, category, parsedAmount, parsedMonth, parsedYear]
    );
    res.status(201).json(newBudget.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ msg: `A budget for '${category}' already exists for this month.` });
    }
    console.error('Error in POST /api/budgets:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/budgets
// @desc    Get all budgets for a specific month and year
// @access  Private
router.get('/', auth, async (req, res) => {
  const { month, year } = req.query;
  const user_id = req.user.id;

  // --- THIS IS THE CRITICAL FIX ---
  // Convert query string parameters to integers before using them.
  const parsedMonth = parseInt(month, 10);
  const parsedYear = parseInt(year, 10);

  if (!parsedMonth || !parsedYear) {
    return res.status(400).json({ msg: 'Valid month and year query parameters are required.' });
  }

  try {
    const budgets = await pool.query(
      'SELECT * FROM budgets WHERE user_id = $1 AND month = $2 AND year = $3 ORDER BY category ASC',
      [user_id, parsedMonth, parsedYear] // Use the parsed integer values
    );
    res.json(budgets.rows);
  } catch (err) {
    console.error('Error in GET /api/budgets:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;