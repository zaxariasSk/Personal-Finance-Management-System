const asyncHandler = require("express-async-handler");
const {StatusCodes} = require("http-status-codes");
const {
    addNewBudget,
    getBudgetListDataByPage,
    getBudgetById,
    deleteBudgetById,
    editBudgetById
} = require("../services/budgetServices");
const {
    UnprocessableEntityError,
    NotFoundError
} = require("../errors/index");
const {getExpensesDataByDate} = require("../services/expensesServices");
const {InternalServerError} = require("../errors");

const getBudgetListByPage = asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const data = await getBudgetListDataByPage(userId, page, limit);

    if (data.hasError) {
        throw new NotFoundError(data.message);
    }

    const {
        rows: entries,
        count: totalItems
    } = data;

    res.status(StatusCodes.OK).json({
        budgetDataList: entries,
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
    });
});

const createNewBudget = asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const budgetData = req.body;
    const [year, month] = budgetData.date.split('-');
    budgetData.year = year;
    budgetData.month = month;

    const newBudget = await addNewBudget(userId, budgetData);

    if (newBudget.hasError) {
        throw new UnprocessableEntityError(newBudget.message);
    }

    res.status(StatusCodes.CREATED).json({
        created: true,
        message: "New budget has been created."
    });
});


const getBudget = asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const budgetId = req.params.id;
    const budgetData = await getBudgetById(userId, budgetId);

    if (budgetData.hasError || budgetData.length <= 0) {
        throw new NotFoundError(budgetData.message);
    }

    res.status(StatusCodes.OK).json({budgetData});
});


const getBudgetData = asyncHandler(async (req, res, next) => {
    const userId = res.locals.user.id;
    const budgetId = req.params.id;
    const page = req.query.page;
    const limit = 5;

    const budgetDate = await getBudgetById(userId, budgetId);

    if (budgetDate.hasError || budgetDate.length <= 0) {
        throw new NotFoundError(budgetDate.message);
    }

    const date = {
        month: budgetDate[0].dataValues.month,
        year: budgetDate[0].dataValues.year
    };
    const category = budgetDate[0].dataValues.category;

    const budgetData = await getExpensesDataByDate(userId, date, category, {page, limit});

    if (budgetData.hasError) {
        throw new NotFoundError(budgetData.message);
    }

    const {
        rows: entries,
        count: totalItems
    } = budgetData;

    res.status(StatusCodes.OK).json({
        expensesList: entries,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: parseInt(page)
    });
});

const deleteBudgetData = asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const budgetId = req.params.id;

    const isDeleted = await deleteBudgetById(budgetId, userId);

    if (isDeleted.hasError) {
        throw new InternalServerError(isDeleted.message);
    }

    res.status(StatusCodes.OK).json({message: "Budget deleted successfully"});
});

const editBudget = asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const budgetId = req.params.id;
    const data = req.body;

    const editedBudget = await editBudgetById(userId, budgetId, data);

    if (editedBudget.hasError) {
        throw new NotFoundError(editedBudget.message);
    }

    res.status(StatusCodes.OK).json({
        editedBudget,
        message: "redirect"
    })
});

module.exports = {
    createNewBudget,
    getBudgetListByPage,
    getBudgetData,
    getBudget,
    deleteBudgetData,
    editBudget
}