// backend/routes/budgets.js

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth'); // Middleware to protect routes

// @route   POST /api/budgets
// @desc    Create a new budget
// @access  Private
router.post('/', auth, async (req, res) => {
  const { category, limit_amount } = req.body;
  const user_id = req.user.id;

  if (!category || !limit_amount) {
    return res.status(400).json({ msg: 'Please provide a category and a limit amount.' });
  }

  try {
    const newBudget = await pool.query(
      'INSERT INTO budgets (user_id, category, limit_amount) VALUES ($1, $2, $3) RETURNING *',
      [user_id, category, limit_amount]
    );
    res.status(201).json(newBudget.rows[0]);
  } catch (err) {
    // Handle unique constraint violation (user already has a budget for this category)
    if (err.code === '23505') {
        return res.status(400).json({ msg: 'A budget for this category already exists.' });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/budgets
// @desc    Get all budgets for a user, including their current spending
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // This advanced query joins budgets with the sum of receipts for each category
    const budgetData = await pool.query(`
        SELECT 
            b.id, 
            b.category, 
            b.limit_amount, 
            COALESCE(SUM(r.amount), 0) as current_spending
        FROM 
            budgets b
        LEFT JOIN 
            receipts r ON b.user_id = r.user_id AND b.category = r.category
        WHERE 
            b.user_id = $1
        GROUP BY 
            b.id, b.category, b.limit_amount
        ORDER BY
            b.category;
    `, [req.user.id]);
    
    res.json(budgetData.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   DELETE /api/budgets/:id
// @desc    Delete a budget
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING *',
            [req.params.id, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Budget not found or user not authorized.' });
        }

        res.json({ msg: 'Budget deleted successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
