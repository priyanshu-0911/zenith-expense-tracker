// backend/routes/receipts.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Your auth middleware
const pool = require('../config/db');

// @route   POST /api/receipts
// @desc    Create a new receipt
// @access  Private
router.post('/', auth, async (req, res) => {
  // Using 'title', 'amount', etc. to match the database table
  const { title, amount, category, transaction_date } = req.body;
  const user_id = req.user.id;

  // Basic validation
  if (!title || !amount || !transaction_date) {
    return res.status(400).json({ msg: 'Please provide title, amount, and transaction_date' });
  }

  try {
    const newReceipt = await pool.query(
      'INSERT INTO receipts (user_id, title, amount, category, transaction_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, title, amount, category, transaction_date]
    );
    res.status(201).json(newReceipt.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/receipts
// @desc    Get all receipts for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const receipts = await pool.query('SELECT * FROM receipts WHERE user_id = $1 ORDER BY transaction_date DESC', [
      req.user.id,
    ]);
    res.json(receipts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/receipts/:id
// @desc    Update a receipt
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, amount, category, transaction_date } = req.body;
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    // Check if the receipt exists and belongs to the user
    const receipt = await pool.query('SELECT * FROM receipts WHERE id = $1 AND user_id = $2', [id, user_id]);
    if (receipt.rows.length === 0) {
      return res.status(404).json({ msg: 'Receipt not found or user not authorized' });
    }

    const updatedReceipt = await pool.query(
      'UPDATE receipts SET title = $1, amount = $2, category = $3, transaction_date = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [title, amount, category, transaction_date, id, user_id]
    );
    res.json(updatedReceipt.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/receipts/:id
// @desc    Delete a receipt
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    // Check if the receipt exists and belongs to the user before deleting
    const result = await pool.query('DELETE FROM receipts WHERE id = $1 AND user_id = $2 RETURNING *', [id, user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ msg: 'Receipt not found or user not authorized' });
    }

    res.json({ msg: 'Receipt deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
