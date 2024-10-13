const sequelize = require('../config/database');
const {DataTypes} = require('sequelize');
const User = require('./userModel');

const Expenses = sequelize.define("Expense", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        foreignKey: {
            model: User,
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM(
            "Beauty",
            "Bills & Fees",
            "Car",
            "Education",
            "Entertainment",
            "Family",
            "Food & Drink",
            "Groceries",
            "Healthcare",
            "Home",
            "Shopping",
            "Sports",
            "Hobbies",
            "Travel",
            "Transport",
            "Work",
            "Other"
        ),
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    }
}, {
    hooks: {
        beforeValidate(expense) {
            if (!expense.description) {
                expense.description = "";
            }
        }
    }
});

module.exports = Expenses;