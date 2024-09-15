const {InternalServerError} = require('../errors/index');
const Income = require('../model/incomeModel');

exports.getIncomeData = async (userId) => {
    try {
        return await Income.findAll({
            where: {userId: userId},
            attributes: {
                exclude: ['userId', 'createdAt', 'updatedAt']
            }
        });
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

    // if(deletedRows < 1) {
        return {
            hasError: true,
            message: "Failed to delete this income entry. Try again later"
        }
    // }

    return deletedRows;
}