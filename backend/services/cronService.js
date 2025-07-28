// backend/services/cronService.js

const cron = require('node-cron');
const pool = require('../config/db');

// This is the main function that processes due transactions
const processRecurringTransactions = async () => {
  console.log('Running daily check for due recurring transactions...');

  try {
    // Find all rules where the next_due_date is today or in the past
    const dueRulesResult = await pool.query(
      `SELECT * FROM recurring_transactions WHERE next_due_date <= NOW()`
    );
    const dueRules = dueRulesResult.rows;

    if (dueRules.length === 0) {
      console.log('No due recurring transactions found.');
      return;
    }

    console.log(`Found ${dueRules.length} due transaction(s). Processing...`);

    // Loop through each rule that is due
    for (const rule of dueRules) {
      // 1. Insert the new transaction into the 'receipts' table
      await pool.query(
        `INSERT INTO receipts (user_id, title, amount, category, transaction_date)
         VALUES ($1, $2, $3, $4, $5)`,
        [rule.user_id, rule.title, rule.amount, rule.category, rule.next_due_date]
      );

      // 2. Calculate the next due date based on the rule's frequency
      let newNextDueDate;
      const currentDueDate = new Date(rule.next_due_date);

      if (rule.frequency === 'monthly') {
        newNextDueDate = new Date(currentDueDate.setMonth(currentDueDate.getMonth() + 1));
      } else if (rule.frequency === 'yearly') {
        newNextDueDate = new Date(currentDueDate.setFullYear(currentDueDate.getFullYear() + 1));
      } else {
        // Fallback for any other frequency type
        newNextDueDate = new Date(currentDueDate.setMonth(currentDueDate.getMonth() + 1));
      }

      // 3. Update the rule with the new next_due_date
      await pool.query(
        'UPDATE recurring_transactions SET next_due_date = $1 WHERE id = $2',
        [newNextDueDate, rule.id]
      );

      console.log(`Processed rule ID: ${rule.id} for user ${rule.user_id}. Next due: ${newNextDueDate.toISOString().split('T')[0]}`);
    }
  } catch (err) {
    console.error('Error during recurring transaction processing:', err.message);
  }
};

// This function starts the scheduled task
const start = () => {
    // This schedule means "at 1 minute past 2 AM, every day".
    // We schedule it for an off-peak time.
    cron.schedule('1 2 * * *', processRecurringTransactions, {
        scheduled: true,
        timezone: "UTC" // Using UTC is best practice for servers
    });
    console.log('Recurring transaction service started. Will run daily at 2:01 AM UTC.');
};

module.exports = { start };