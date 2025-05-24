const { DataTypes } = require('sequelize');
const User = require('./userModel');  // Assuming you have a user model
const sequelize = require('../config/database');  // Your Sequelize instance

const Goal = sequelize.define('Goal', {
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
    targetAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    savedAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Goal;
