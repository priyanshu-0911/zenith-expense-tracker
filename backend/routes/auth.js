// backend/routes/auth.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const auth = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// @route   GET /api/auth
// @desc    Get logged-in user's data
router.get('/', auth, async (req, res) => {
  try {
    // Select username as well
    const user = await pool.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [req.user.id]);
    if (user.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user.rows[0]);
  } catch (err) {
    console.error('Error in GET /api/auth:', err.message);
    res.status(500).send('Server Error');
  }
});


// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  // --- FIX: Read 'username' from the request body ---
  const { username, email, password } = req.body;

  // --- FIX: Add validation for username ---
  if (!username || !email || !password || password.length < 6) {
    return res.status(400).json({ msg: 'Please provide a username, a valid email, and a password of at least 6 characters.' });
  }

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ msg: 'User with this email or username already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // --- FIX: Insert the 'username' into the database ---
    const newUserResult = await pool.query(
      'INSERT INTO users (username, email, hashed_pw) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, hashedPassword]
    );
    const newUser = newUserResult.rows[0];

    const payload = { user: { id: newUser.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: newUser,
        });
      }
    );
  } catch (err) {
    console.error('Error in POST /api/auth/register:', err.message);
    res.status(500).send('Server Error');
  }
});


// @route   POST /api/auth/login
// @desc    Authenticate user & get token (Login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.hashed_pw);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = { user: { id: user.id } };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    token,
                    user: {
                      id: user.id,
                      username: user.username, // Include username on login
                      email: user.email,
                      created_at: user.created_at
                    }
                });
            }
        );
    } catch (err) {
        console.error('Error in POST /api/auth/login:', err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;