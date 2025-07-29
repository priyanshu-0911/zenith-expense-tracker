// backend/routes/setup.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/create-tables', async (req, res) => {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      hashed_pw VARCHAR(255) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS goals (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      target_amount NUMERIC(12, 2) NOT NULL,
      current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
      target_date DATE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS funds (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      goal_id INTEGER REFERENCES goals(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      category VARCHAR(100) NOT NULL,
      transaction_date DATE NOT NULL,
      fund_id INTEGER REFERENCES funds(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS budgets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      category VARCHAR(100) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      fund_id INTEGER REFERENCES funds(id) ON DELETE CASCADE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, category, month, year)
    );

    CREATE TABLE IF NOT EXISTS recurring_transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(100) NOT NULL,
      amount NUMERIC(10, 2) NOT NULL,
      category VARCHAR(50) NOT NULL,
      frequency VARCHAR(20) NOT NULL,
      start_date DATE NOT NULL,
      next_due_date DATE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(createTablesQuery);
    res.status(200).json({ message: "All tables created successfully or already exist." });
  } catch (err) {
    console.error("Error creating tables:", err.message);
    res.status(500).json({ error: "Failed to create tables.", message: err.message });
  }
});

module.exports = router;