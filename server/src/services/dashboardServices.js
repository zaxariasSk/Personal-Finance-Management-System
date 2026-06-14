const { InternalServerError } = require("../errors/index");
const Income = require("../models/incomeModel");
const Expenses = require("../models/expensesModel");
const Goal = require("../models/goalModel");
const { Op } = require('sequelize');
const sequelize = require("../config/database");

exports.getDashboardSummary = async (userId) => {
    try {
        // Get current month and year
        const now = new Date();
        const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
        const currentYear = now.getFullYear();

        // Calculate total balance (all income - all expenses)
        const [totalIncomeResult] = await Income.findAll({
            where: { userId },
            attributes: [
                [Income.sequelize.fn('SUM', Income.sequelize.col('amount')), 'total']
            ],
            raw: true
        });

        const [totalExpensesResult] = await Expenses.findAll({
            where: { userId },
            attributes: [
                [Expenses.sequelize.fn('SUM', Expenses.sequelize.col('amount')), 'total']
            ],
            raw: true
        });

        const totalIncome = parseFloat(totalIncomeResult?.total || 0);
        const totalExpenses = parseFloat(totalExpensesResult?.total || 0);
        const totalBalance = totalIncome - totalExpenses;

        // Calculate monthly income (current month)
        const [monthlyIncomeResult] = await Income.findAll({
            where: {
                userId,
                [Op.and]: [
                    Income.sequelize.where(Income.sequelize.fn('MONTH', Income.sequelize.col('date')), currentMonth),
                    Income.sequelize.where(Income.sequelize.fn('YEAR', Income.sequelize.col('date')), currentYear)
                ]
            },
            attributes: [
                [Income.sequelize.fn('SUM', Income.sequelize.col('amount')), 'total']
            ],
            raw: true
        });

        // Calculate monthly expenses (current month)
        const [monthlyExpensesResult] = await Expenses.findAll({
            where: {
                userId,
                [Op.and]: [
                    Expenses.sequelize.where(Expenses.sequelize.fn('MONTH', Expenses.sequelize.col('date')), currentMonth),
                    Expenses.sequelize.where(Expenses.sequelize.fn('YEAR', Expenses.sequelize.col('date')), currentYear)
                ]
            },
            attributes: [
                [Expenses.sequelize.fn('SUM', Expenses.sequelize.col('amount')), 'total']
            ],
            raw: true
        });

        const monthlyIncome = parseFloat(monthlyIncomeResult?.total || 0);
        const monthlyExpenses = parseFloat(monthlyExpensesResult?.total || 0);

        // Count active goals (goals that are not completed - savedAmount < targetAmount)
        const activeGoalsCount = await Goal.count({
            where: {
                userId,
                [Op.and]: [
                    sequelize.where(sequelize.col('savedAmount'), '<', sequelize.col('targetAmount'))
                ]
            }
        });

        return {
            totalBalance,
            monthlyIncome,
            monthlyExpenses,
            activeGoals: activeGoalsCount
        };

    } catch (error) {
        console.error('Dashboard summary error:', error);
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.");
    }
};