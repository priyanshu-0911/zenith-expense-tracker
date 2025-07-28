// backend/routes/funds.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../config/db');

// @route   POST /api/funds
// @desc    Create a new Fund
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, goal_id } = req.body;
  const user_id = req.user.id;

  if (!name) {
    return res.status(400).json({ msg: 'Please provide a name for the fund.' });
  }

  try {
    const newFund = await pool.query(
      'INSERT INTO funds (user_id, name, goal_id) VALUES ($1, $2, $3) RETURNING *',
      [user_id, name, goal_id || null]
    );
    res.status(201).json(newFund.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/funds
// @desc    Get all funds for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const funds = await pool.query(
      'SELECT f.*, g.target_amount, g.current_amount FROM funds f LEFT JOIN goals g ON f.goal_id = g.id WHERE f.user_id = $1 ORDER BY f.created_at DESC',
      [req.user.id]
    );
    res.json(funds.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/funds/:id
// @desc    Get a single fund with its associated budgets and transactions
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const fundId = req.params.id;
        const userId = req.user.id;

        // 1. Get the fund and its linked goal details
        const fundQuery = `
            SELECT f.*, g.name as goal_name, g.target_amount, g.current_amount 
            FROM funds f 
            LEFT JOIN goals g ON f.goal_id = g.id 
            WHERE f.id = $1 AND f.user_id = $2`;
        const fundResult = await pool.query(fundQuery, [fundId, userId]);

        if (fundResult.rows.length === 0) {
            return res.status(404).json({ msg: 'Fund not found.' });
        }

        // 2. Get budgets linked to this fund
        const budgetsQuery = `SELECT * FROM budgets WHERE fund_id = $1 AND user_id = $2`;
        const budgetsResult = await pool.query(budgetsQuery, [fundId, userId]);

        // 3. Get transactions linked to this fund
        const transactionsQuery = `SELECT * FROM receipts WHERE fund_id = $1 AND user_id = $2`;
        const transactionsResult = await pool.query(transactionsQuery, [fundId, userId]);

        const fundDetails = {
            ...fundResult.rows[0],
            budgets: budgetsResult.rows,
            transactions: transactionsResult.rows,
        };

        res.json(fundDetails);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;