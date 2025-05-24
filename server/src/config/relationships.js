const User = require('../models/userModel');
const Session = require('../models/sessionModel');
const Income = require('../models/incomeModel');
const Expense = require('../models/expensesModel');
const Budget = require('../models/budgetModel');
const Goal = require("../models/goalModel");
const GoalContribution = require("../models/goalContribution");

User.hasMany(Session, {foreignKey: 'userId'});
Session.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'userId'
});

User.hasMany(Income, {foreignKey: 'userId'});
Income.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: 'userId'
});

User.hasMany(Expense, {foreignKey: "userId"});
Expense.belongsTo(User, {
    constraints: true,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    foreignKey: "userId"
});

User.hasMany(Budget, {foreignKey: 'userId'});
Budget.belongsTo(User, {
    foreignKey: 'userId',
    constraints: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

User.hasMany(Goal, {foreignKey: 'userId'});
Goal.belongsTo(User, {
    foreignKey: 'userId',
    constraints: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});


User.hasMany(GoalContribution, {foreignKey: 'userId'});
GoalContribution.belongsTo(User, {
    foreignKey: 'userId',
    constraints: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Goal.hasMany(GoalContribution, {foreignKey: 'goalId'});
GoalContribution.belongsTo(Goal, {
    foreignKey: 'goalId',
    constraints: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});