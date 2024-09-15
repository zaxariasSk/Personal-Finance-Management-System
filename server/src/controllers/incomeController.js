const asyncHandler = require("express-async-handler");
const {getIncomeData,
    addNewIncome
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

module.exports = {
    getIncome,
    setNewIncome
}