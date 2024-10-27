const asyncHandler = require("express-async-handler");
const {
    getExpensesData,
    getExpensesDataByPage,
    addNewExpenses,
    deleteExpensesById,
    editExpensesById,
    getExpensesById
} = require("../services/expensesServices");
const {
    InternalServerError,
    NotFoundError,
    UnprocessableEntityError,
} = require("../errors/index");
const {StatusCodes} = require("http-status-codes");

const getAllExpenses = asyncHandler(async (req, res, next) => {
    const user = res.locals.user;

    const data = await getExpensesData(user.id);

    res.status(StatusCodes.OK).json(data);
});

const getExpensesByPage = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const userId = res.locals.user.id;
    const limit = 5;

    const data = await getExpensesDataByPage(userId, page, limit);

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

const createNewExpenses = asyncHandler(async (req, res, next) => {
    const userId = res.locals.user.id;
    const data = req.body;

    const newExpenses = await addNewExpenses(userId, data);

    if (newExpenses.hasError) {
        throw new UnprocessableEntityError(newExpenses.message);
    }

    res.status(StatusCodes.CREATED).json({
        created: true,
        message: "New expenses created successfully"
    });
});

const deleteExpenses = asyncHandler(async (req, res) => {
    const {expenseId} = req.params;
    const userId = res.locals.user.id;

    const result = await deleteExpensesById(userId, expenseId);

    if (result.hasError) {
        throw new InternalServerError(result.message);
    }

    res.status(StatusCodes.OK).json({message: "Expenses deleted successfully"});
});

const editExpenses = asyncHandler(async (req, res) => {
    console.log(req.params);
    const {expenseId} = req.params;
    const userId = res.locals.user.id
    const data = req.body;

    const editedEntry = await editExpensesById(userId, expenseId, data);

    if (editedEntry.hasError) {
        throw new NotFoundError(editedEntry.message);
    }

    res.status(StatusCodes.OK).json({
        editedEntry,
        message: "redirect"
    });
});

const getExpenses = asyncHandler(async (req, res) => {
    const {expenseId} = req.params;
    const userId = res.locals.user.id;

    const expenses = await getExpensesById(userId, expenseId);
    console.log(expenses)
    if (expenses.hasError) {
        throw new NotFoundError(expenses.message);
    }

    res.status(StatusCodes.OK).json(expenses);
});

module.exports = {
    getAllExpenses,
    createNewExpenses,
    deleteExpenses,
    editExpenses,
    getExpenses,
    getExpensesByPage
}