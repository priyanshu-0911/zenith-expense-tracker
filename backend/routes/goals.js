// backend/routes/goals.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Your auth middleware
const pool = require('../config/db');

// @route   GET /api/goals
// @desc    Get all of a user's financial goals
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const goals = await pool.query(
      'SELECT * FROM goals WHERE user_id = $1 ORDER BY target_date ASC',
      [req.user.id]
    );
    res.json(goals.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/goals
// @desc    Create a new financial goal
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name, target_amount, target_date } = req.body;
  const user_id = req.user.id;

  if (!name || !target_amount) {
    return res.status(400).json({ msg: 'Please provide a name and target amount.' });
  }

  try {
    const newGoal = await pool.query(
      `INSERT INTO goals (user_id, name, target_amount, target_date) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, name, target_amount, target_date || null]
    );
    res.status(201).json(newGoal.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/goals/:id/add-savings
// @desc    Add to a goal's current saved amount
// @access  Private
router.put('/:id/add-savings', auth, async (req, res) => {
    const { amount } = req.body;
    const { id } = req.params;
    const user_id = req.user.id;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        return res.status(400).json({ msg: 'Please provide a valid positive amount to add.' });
    }

    try {
        const updatedGoal = await pool.query(
            `UPDATE goals 
             SET current_amount = current_amount + $1 
             WHERE id = $2 AND user_id = $3 RETURNING *`,
            [amount, id, user_id]
        );

        if (updatedGoal.rows.length === 0) {
            return res.status(404).json({ msg: 'Goal not found or user not authorized.' });
        }
        res.json(updatedGoal.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;