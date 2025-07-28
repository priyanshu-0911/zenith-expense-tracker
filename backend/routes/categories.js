// backend/routes/categories.js

const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth'); // Middleware to protect routes

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  const user_id = req.user.id;

  if (!name) {
    return res.status(400).json({ msg: 'Please provide a category name' });
  }

  try {
    // Check if the user already has a category with the same name
    const existingCategory = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 AND name = $2',
      [user_id, name]
    );

    if (existingCategory.rows.length > 0) {
      return res.status(400).json({ msg: 'Category with this name already exists' });
    }

    const newCategory = await pool.query(
      'INSERT INTO categories (user_id, name) VALUES ($1, $2) RETURNING *',
      [user_id, name]
    );

    res.status(201).json(newCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/categories
// @desc    Get all categories for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const categories = await pool.query(
        'SELECT * FROM categories WHERE user_id = $1 ORDER BY name', 
        [req.user.id]
    );
    res.json(categories.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const result = await pool.query(
            'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *',
            [req.params.id, req.user.id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Category not found or user not authorized' });
        }

        res.json({ msg: 'Category deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
