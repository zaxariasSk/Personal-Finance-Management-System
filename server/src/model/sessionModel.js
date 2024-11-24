const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');

const Session = sequelize.define('Session', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id'
        },
        allowNull: false
    },
    valid: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    userAgent: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true
});

module.exports = Session;
