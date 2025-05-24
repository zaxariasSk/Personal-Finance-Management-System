const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GoalContribution = sequelize.define('GoalContribution', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: User, key: 'id' }
    },
    goalId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: Goal, key: 'id' }
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    }
});

User.hasMany(GoalContribution, { foreignKey: 'userId' });
GoalContribution.belongsTo(User, { foreignKey: 'userId' });

Goal.hasMany(GoalContribution, { foreignKey: 'goalId' });
GoalContribution.belongsTo(Goal, { foreignKey: 'goalId' });

module.exports = GoalContribution;
