// backend/routes/categories.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pool = require('../config/db');

// @route   GET /api/categories
// @desc    Get all of a user's custom categories
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const categories = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY name ASC',
      [req.user.id]
    );
    res.json(categories.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

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
    const categoryExists = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 AND lower(name) = lower($2)',
      [user_id, name]
    );
    if (categoryExists.rows.length > 0) {
      return res.status(400).json({ msg: 'Category already exists' });
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

// --- NEW CODE STARTS HERE ---

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    const user_id = req.user.id;

    if (!name) {
        return res.status(400).json({ msg: 'Please provide a new name' });
    }

    try {
        const updatedCategory = await pool.query(
            'UPDATE categories SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [name, id, user_id]
        );

        if (updatedCategory.rows.length === 0) {
            return res.status(404).json({ msg: 'Category not found or user not authorized' });
        }

        res.json(updatedCategory.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        const result = await pool.query(
            'DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, user_id]
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