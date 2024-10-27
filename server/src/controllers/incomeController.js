const asyncHandler = require("express-async-handler");
const {
    getIncomeData,
    getIncomeDataByPage,
    addNewIncome,
    deleteIncomeById,
    editIncomeById,
    getIncomeById
} = require("../services/incomeServices");
const {
    InternalServerError,
    NotFoundError,
} = require("../errors");
const {StatusCodes} = require("http-status-codes");

const getAllIncome = asyncHandler(async (req, res, next) => {
    const user = res.locals.user;

    const data = await getIncomeData(user.id);

    res.status(StatusCodes.OK).json(data);
});

const getIncomeByPage = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const userId = res.locals.user.id;
    const limit = 5;

    const data = await getIncomeDataByPage(userId, page, limit);

    if (data.hasError) {
        throw new NotFoundError(data.message);
    }

    const {
        rows: entries,
        count: totalItems
    } = data;

    res.status(StatusCodes.OK).json({
        data: entries,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
    });
});

const createNewIncome = asyncHandler(async (req, res, next) => {
    const userId = res.locals.user.id;
    const data = req.body;
    const newIncome = await addNewIncome(userId, data);

    if (newIncome.hasError) {
        throw new InternalServerError(newIncome.message);
    }

    res.status(StatusCodes.CREATED).json({
        created: true,
        message: "New income created successfully",
    });
});

const deleteIncome = asyncHandler(async (req, res) => {
    const {incomeId} = req.params;
    const userId = res.locals.user.id;

    const result = await deleteIncomeById(userId, incomeId);

    if (result.hasError) {
        throw new InternalServerError(result.message);
    }

    res.status(StatusCodes.OK).json({message: "Income deleted successfully"});
});

const editIncome = asyncHandler(async (req, res) => {
    const {incomeId} = req.params;
    const userId = res.locals.user.id
    const data = req.body;

    const editedEntry = await editIncomeById(userId, incomeId, data);

    if (editedEntry.hasError) {
        throw new NotFoundError(editedEntry.message);
    }

    res.status(StatusCodes.OK).json({
        editedEntry,
        message: "redirect"
    });
});

const getIncome = asyncHandler(async (req, res) => {
    const {incomeId} = req.params;
    const userId = res.locals.user.id;

    const income = await getIncomeById(userId, incomeId);

    if (income.hasError) {
        throw new NotFoundError(income.message);
    }

    res.status(StatusCodes.OK).json(income);
});

module.exports = {
    getAllIncome,
    createNewIncome,
    deleteIncome,
    editIncome,
    getIncome,
    getIncomeByPage
}