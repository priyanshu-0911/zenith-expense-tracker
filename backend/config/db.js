// backend/config/db.js

const { Pool } = require('pg');
require('dotenv').config();

// --- THIS IS THE FIX ---
// This object will hold our connection settings.
const connectionConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};

// When the application is running on Render, Render automatically sets
// NODE_ENV to 'production'. We check for this and add the SSL requirement.
if (process.env.NODE_ENV === 'production') {
  connectionConfig.ssl = {
    rejectUnauthorized: false
  };
}
// --- END OF FIX ---


const pool = new Pool(connectionConfig);

// Test the database connection
pool.connect((err, client, done) => {
  if (err) {
    console.error('DATABASE CONNECTION ERROR:', err.message);
    console.error('Please check your environment variables and SSL configuration.');
    return;
  }
  console.log(`Successfully connected to the database "${client.database}".`);
  client.release();
});

module.exports = pool;