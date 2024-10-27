const Budget = require("../model/budgetModel");
const {InternalServerError} = require("../errors/index");

exports.getBudgetDataByPage = async (userId, page, limit) => {
    try {
        const {
            count,
            rows
        } = await Budget.findAll({
            where: {
                userId
            },
            order: [
                ['date', 'DESC'],
            ],
            offset: (page - 1) * limit,
            limit,
            attributes: {exclude: ['userId', "createdAt", "updateAt"]}
        });

        if (!count && !rows) {
            return {
                hasError: true,
                message: "No expenses data found"
            };
        }

        return {
            rows,
            count
        }
    } catch (e) {
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.")
    }
}


exports.addNewBudget = async (userId, data) => {
    try {
        const newBudget = await Budget.create({
            userId,
            amount: data.amount,
            category: data.category,
            month: data.month,
            year: data.year,
        });

        if (!newBudget) {
            return {
                hasError: true,
                message: "Failed to add new budget data. Please try again later"
            }
        }

        return newBudget;
    } catch (e) {
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.")
    }
}