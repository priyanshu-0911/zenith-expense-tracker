// backend/routes/recurring.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Your auth middleware
const pool = require('../config/db');

// @route   GET /api/recurring
// @desc    Get all recurring transaction rules for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const recurringTxs = await pool.query(
      'SELECT * FROM recurring_transactions WHERE user_id = $1 ORDER BY next_due_date ASC',
      [req.user.id]
    );
    res.json(recurringTxs.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/recurring
// @desc    Create a new recurring transaction rule
// @access  Private
router.post('/', auth, async (req, res) => {
  const { title, amount, category, frequency, start_date } = req.body;
  const user_id = req.user.id;

  // Basic validation
  if (!title || !amount || !category || !frequency || !start_date) {
    return res.status(400).json({ msg: 'Please provide all required fields.' });
  }

  try {
    // The next_due_date is initially the same as the start_date
    const newRule = await pool.query(
      `INSERT INTO recurring_transactions 
       (user_id, title, amount, category, frequency, start_date, next_due_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $6) RETURNING *`,
      [user_id, title, amount, category, frequency, start_date]
    );
    res.status(201).json(newRule.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;