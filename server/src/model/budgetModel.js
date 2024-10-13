// models/budget.js
const { DataTypes } = require('sequelize');
const User = require('./userModel');  // Assuming you have a user model
const sequelize = require('../config/database');  // Your Sequelize instance

const Budget = sequelize.define('Budget', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    month: {
        type: DataTypes.STRING,  // Store the month as a string ("January", "February", etc.)
        allowNull: false,
    },
    year: {
        type: DataTypes.STRING,  // Store the year as a string (e.g., "2024")
        allowNull: false,
    },
});

// Define relationships between User and Budget
User.hasMany(Budget, { foreignKey: 'userId' });
Budget.belongsTo(User, {
    foreignKey: 'userId',
    constraints: true,
    onDelete: 'CASCADE',  // If a user is deleted, their budgets should also be deleted
    onUpdate: 'CASCADE'
});

module.exports = Budget;
