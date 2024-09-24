const {InternalServerError} = require("../errors/index");
const Income = require("../model/incomeModel");

exports.getIncomeData = async (userId) => {
    try {
        return await Income.findAll({
            where: {userId: userId},
            attributes: {
                exclude: ["userId", "createdAt", "updatedAt"]
            }
        });
    } catch (e) {
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.")
    }

}

exports.getIncomeDataByPage = async (userId, page, limit) => {
    try {
        const {count, rows} = await Income.findAndCountAll({
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
                message: "No income data found"
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

exports.addNewIncome = async (userId, data) => {
    const income = await Income.create({
        userId,
        amount: data.amount,
        source: data.source,
        date: new Date(data.date),
        description: data.description || null
    });

    if (!income) {
        return {
            hasError: true,
            message: "Failed to add new income data. Please try again later"
        };
    }

    return income;
}

exports.deleteIncomeById = async (userId, id) => {
    const deletedRows = await Income.destroy({
        where: {
            id,
            userId
        }
    });

    if (deletedRows < 1) {
        return {
            hasError: true,
            message: "Failed to delete this income entry. Try again later"
        }
    }

    return deletedRows;
}

exports.editIncomeById = async (userId, incomeId, data) => {
    try {
        console.log("data: " + JSON.stringify(data))
        const editedEntry = await Income.update(
            data,
            {
                where: {
                    id: incomeId,
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

exports.getIncomeById = async (userId, incomeId) => {
    const editedEntry = await Income.findOne({
        where: {
            id: incomeId,
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