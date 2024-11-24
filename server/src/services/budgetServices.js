const Budget = require("../model/budgetModel");
const {InternalServerError} = require("../errors/index");

exports.getBudgetListDataByPage = async (userId, page, limit) => {
    try {
        const {
            count,
            rows
        } = await Budget.findAndCountAll({
            where: {
                userId
            },
            order: [
                ['year', 'DESC'],
                ['month', 'DESC'],
            ],
            offset: (page - 1) * limit,
            limit,
            attributes: {exclude: ['userId', "createdAt", "updatedAt"]}
        });

        if (!count && !rows) {
            return {
                hasError: true,
                message: "No budget data found"
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
        const budgetExists = await Budget.findOne({
            where: {
                category: data.category,
                month: data.month,
                year: data.year,
            }
        })

        if(budgetExists) {
            return {
                hasError: true,
                message: "This budget already exists."
            }
        }

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

exports.getBudgetById = async (userId, budgetId) => {
    try {
        const budget = await Budget.findAll({
            where: {
                userId,
                id: budgetId
            },
            attributes: {exclude: ["userId", "createdAt", "updatedAt"]}
        });

        if (!budget) {
            return {
                hasError: true,
                message: "Failed to find budget's data"
            }
        }

        return budget;
    } catch (e) {
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.")
    }
}

exports.getBudgetDate = async (userId, budgetId) => {
    try {
        const date = await Budget.findAll({
            where: {
                userId,
                id: budgetId
            },
            attributes: ["month", "year"]
        });

        if (!date) {
            return {
                hasError: true,
                message: "Failed to find budget's data or date"
            }
        }

        return date;
    } catch (e) {
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.")
    }
}

exports.deleteBudgetById = async (budgetId, userId) => {
    try {
        const res = await Budget.destroy({
            where: {
                userId,
                budgetId
            }
        });

        if (!res) {
            return {
                hasError: true,
                message: "Failed to delete Budget"
            }
        }

        return res;
    } catch (e) {
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.")
    }
}