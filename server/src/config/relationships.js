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

// Many-to-Many relationship between Budget and Expense
Budget.belongsToMany(Expense, {
    through: 'BudgetExpense', // Name of the junction table
    foreignKey: 'budgetId', // Foreign key in BudgetExpense pointing to Budget
    otherKey: 'expenseId', // Foreign key in BudgetExpense pointing to Expense
    onDelete: 'CASCADE', // Optional: specify behavior when a budget is deleted
    onUpdate: 'CASCADE',
});

Expense.belongsToMany(Budget, {
    through: 'BudgetExpense', // Name of the junction table
    foreignKey: 'expenseId', // Foreign key in BudgetExpense pointing to Expense
    otherKey: 'budgetId', // Foreign key in BudgetExpense pointing to Budget
    onDelete: 'CASCADE', // Optional: specify behavior when an expense is deleted
    onUpdate: 'CASCADE',
});