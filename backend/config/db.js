const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres', // <--- This is your_user
  host: 'localhost',
  database: 'expense_tracker', // <--- This is your_db_name
  password: 'Thanos', // You'll need this password
  port: 5432,
});

// Test the database connection
pool.connect((err, client, done) => {
  if (err) {
    console.error('Database connection error:', err.message);
    return;
  }
  console.log('Successfully connected to the database.');
  client.release(); // Release the client back to the pool
});

module.exports = pool;