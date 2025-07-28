// backend/routes/recurring.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
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

  if (!title || !amount || !category || !frequency || !start_date) {
    return res.status(400).json({ msg: 'Please provide all required fields.' });
  }
  try {
    const newRule = await pool.query(
      `INSERT INTO recurring_transactions 
       (user_id, title, amount, category, frequency, start_date, next_due_date) 
       VALUES ($1, $2, $3, $4, $5, $6, $6) RETURNING *`,
      [user_id, title, amount, category, frequency, start_date]
    );
    res.status(201).json(newRule.rows[0]);
  } catch (err) { // <<<--- THE FIX IS HERE. THE EXTRA '.js' HAS BEEN REMOVED.
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/recurring/:id
// @desc    Update a recurring transaction rule
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { title, amount, category, frequency, start_date } = req.body;
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        const updatedRule = await pool.query(
            `UPDATE recurring_transactions 
             SET title = $1, amount = $2, category = $3, frequency = $4, start_date = $5
             WHERE id = $6 AND user_id = $7 RETURNING *`,
            [title, amount, category, frequency, start_date, id, user_id]
        );

        if (updatedRule.rows.length === 0) {
            return res.status(404).json({ msg: 'Rule not found or user not authorized' });
        }
        res.json(updatedRule.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/recurring/:id
// @desc    Delete a recurring transaction rule
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        const result = await pool.query(
            'DELETE FROM recurring_transactions WHERE id = $1 AND user_id = $2',
            [id, user_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Rule not found or user not authorized' });
        }
        res.json({ msg: 'Recurring transaction rule deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;