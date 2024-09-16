const asyncHandler = require("express-async-handler");
const {getIncomeData,
    addNewIncome,
    deleteIncomeById
} = require("../services/incomeServices");
const {InternalServerError} = require("../errors");

const getIncome = asyncHandler (async (req, res, next) => {
    const user = res.locals.user;

    const data = await getIncomeData(user.id);

    res.status(200).json(data);
});

const setNewIncome = asyncHandler( async (req, res, next) => {
    const userId = res.locals.user.id;
    const data = req.body;
    const newIncome = await addNewIncome(userId, data);

    if(newIncome.hasError) {
        throw new InternalServerError(newIncome.message);
    }

    res.status(200).json({message: "New income created successfully", newIncome});
});

const deleteIncome = asyncHandler( async (req, res) => {
    const {incomeId} = req.params;
    const userId = res.locals.user.id;

    const result = await deleteIncomeById(userId, incomeId);

    if(result.hasError) {
        throw new InternalServerError(result.message);
    }

    res.status(200).json({message: "Income deleted successfully"});
});

module.exports = {
    getIncome,
    setNewIncome,
    deleteIncome
}