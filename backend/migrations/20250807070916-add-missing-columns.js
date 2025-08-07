'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Adds 'category' and 'transaction_date' to the 'receipts' table
    await queryInterface.addColumn('receipts', 'category', {
      type: Sequelize.STRING,
      allowNull: true, // Set to false if this is a required field
    });

    await queryInterface.addColumn('receipts', 'transaction_date', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    });

    // The error mentioned 'f.goal_id', which likely means the 'goal_id' column
    // belongs to the 'receipts' table. If it's on another table, just
    // change 'receipts' to the correct table name below.
    await queryInterface.addColumn('receipts', 'goal_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    // This part runs if you ever need to undo the changes
    await queryInterface.removeColumn('receipts', 'category');
    await queryInterface.removeColumn('receipts', 'transaction_date');
    await queryInterface.removeColumn('receipts', 'goal_id');
  }
};