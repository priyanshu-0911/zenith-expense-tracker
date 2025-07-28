// backend/routes/users.js

const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const auth = require('../middleware/auth'); // Our authentication middleware

const router = express.Router();

// @route   PUT /api/users/change-password
// @desc    Change user's password
// @access  Private
router.put('/change-password', auth, async (req, res) => {
  // Get all required fields from the request body
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  const userId = req.user.id; // Get user ID from the token via auth middleware

  // 1. Basic Validation
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return res.status(400).json({ msg: 'Please provide all required fields.' });
  }

  // Validate that the new password and confirmation match
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ msg: 'New passwords do not match.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ msg: 'New password must be at least 6 characters long.' });
  }

  try {
    // 2. Get the user's current hashed password from the database
    const userResult = await pool.query('SELECT hashed_pw FROM users WHERE id = $1', [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ msg: 'User not found.' });
    }

    const storedPasswordHash = userResult.rows[0].hashed_pw;

    // 3. Compare the provided current password with the stored hash
    const isMatch = await bcrypt.compare(currentPassword, storedPasswordHash);

    if (!isMatch) {
      // Use a 401 status code for authorization failure
      return res.status(401).json({ msg: 'Incorrect current password.' });
    }

    // 4. Hash the new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // 5. Update the user's password in the database
    await pool.query('UPDATE users SET hashed_pw = $1 WHERE id = $2', [newHashedPassword, userId]);

    res.json({ msg: 'Password updated successfully.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
