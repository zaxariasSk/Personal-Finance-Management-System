const {DataTypes} = require('sequelize');
const User = require('./userModel');
const sequelize = require('../config/database');

const Income = sequelize.define('Income', {
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
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    source: {
        type: DataTypes.ENUM(
            "Salary",
            "Business",
            "Client",
            "Gifts",
            "Insurance",
            "Loan",
            "Stocks",
            "Other"
        ),
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
});

module.exports = Income;