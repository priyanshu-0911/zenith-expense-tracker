// server.js
require('dotenv').config();
require('./config/db');

const express = require('express');
const cronService = require('./services/cronService');
const app = express();
const PORT = process.env.PORT || 5000;

// CORRECT ORDER: Middleware to parse JSON must come BEFORE routes
app.use(express.json());

// Define API routes here
app.use('/api/auth', require('./routes/auth'));
app.use('/api/receipts', require('./routes/receipts'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/recurring', require('./routes/recurring'));
app.use('/api/goals', require('./routes/goals'));
app.use('/api/funds', require('./routes/funds'));
app.use('/api/budgets', require('./routes/budgets'));

// This is just a test route, it's fine here
app.get('/', (req, res) => {
  res.send('Smart Expense Tracker Backend is Running!');
});

// REMOVED the duplicate app.use('/api/auth'...) from down here
// --- TEMPORARY DIAGNOSTIC TOOL ---
const pool = require('./config/db'); // Make sure this path is correct

app.get('/api/debug-db', async (req, res) => {
    try {
        const connectionParams = {
            user: pool.options.user,
            host: pool.options.host,
            database: pool.options.database,
            port: pool.options.port,
        };

        const query = `
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'budgets';
        `;

        const result = await pool.query(query);

        res.json({
            message: "Database Diagnostic Report",
            connected_to: connectionParams,
            budgets_table_columns: result.rows.map(row => `${row.column_name} (${row.data_type})`),
        });

    } catch (err) {
        res.status(500).json({ 
            error: "Failed to run diagnostics.",
            message: err.message,
            connected_to: {
                user: pool.options.user,
                host: pool.options.host,
                database: pool.options.database,
                port: pool.options.port,
            }
        });
    }
});
// --- END OF DIAGNOSTIC TOOL ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access it at: http://localhost:${PORT}`);
  cronService.start();
});

// --- Use API Routes ---
app.use('/api/auth', require('./routes/auth'));
app.use('/api/receipts', require('./routes/receipts'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/users', require('./routes/users'));
app.use('/api/budgets', require('./routes/budgets')); // ADD THIS LINE