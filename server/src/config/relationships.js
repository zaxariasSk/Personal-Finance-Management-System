const User = require('../model/userModel');
const Session = require('../model/sessionModel');
const Income = require('../model/incomeModel');
const Expense = require('../model/expensesModel');
const Budget = require('../model/budgetModel');

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