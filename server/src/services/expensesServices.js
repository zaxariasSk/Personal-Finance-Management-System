const {InternalServerError} = require("../errors/index");
const Expenses = require("../model/expensesModel");

exports.getExpensesData = async (userId) => {
    try {
        return await Expenses.findAll({
            where: {userId: userId},
            attributes: {
                exclude: ["userId", "createdAt", "updatedAt"]
            }
        });
    } catch (e) {
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.")
    }

}

exports.getExpensesDataByPage = async (userId, page, limit) => {
    try {
        const {count, rows} = await Expenses.findAndCountAll({
            where: {
                userId
            },
            order: [
                ['date', 'DESC'],
            ],
            offset: (page - 1) * limit,
            limit,
            attributes: {
                exclude: ["userId", "createdAt", "updatedAt"]
            }
        });

        if(!count && !rows) {
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

exports.addNewExpenses = async (userId, data) => {
    const expenses = await Expenses.create({
        userId,
        amount: data.amount,
        category: data.category,
        date: new Date(data.date),
        description: data.description || null
    });

    if (!expenses) {
        return {
            hasError: true,
            message: "Failed to add new expenses data. Please try again later"
        };
    }

    return expenses;
}

exports.deleteExpensesById = async (userId, id) => {
    const deletedRows = await Expenses.destroy({
        where: {
            id,
            userId
        }
    });

    if (deletedRows < 1) {
        return {
            hasError: true,
            message: "Failed to delete this expenses entry. Try again later"
        }
    }

    return deletedRows;
}

exports.editExpensesById = async (userId, expensesId, data) => {
    try {
        console.log("data: " + JSON.stringify(data))
        const editedEntry = await Expenses.update(
            data,
            {
                where: {
                    id: expensesId,
                    userId
                }
            });

        if (editedEntry <= 0) {
            return {
                hasError: true,
                message: "Failed to edit this entry"
            }
        }

        return editedEntry;
    } catch (e) {
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.")
    }
}

exports.getExpensesById = async (userId, expensesId) => {
    const editedEntry = await Expenses.findOne({
        where: {
            id: expensesId,
            userId: userId
        },
        attributes: {
            exclude: ["userId", "createdAt", "updatedAt", "id"]
        }
    });

    if (!editedEntry) {
        return {
            hasError: true,
            message: "Failed to find this entry"
        }
    }

    return editedEntry;
}