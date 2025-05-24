const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path to your Sequelize instance

const BudgetExpense = sequelize.define('BudgetExpense', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // Add other columns if needed
}, {
    timestamps: false, // Disable timestamps if not required
    tableName: 'BudgetExpenses', // Explicitly set table name
});

module.exports = BudgetExpense;
