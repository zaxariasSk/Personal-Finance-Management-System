const asyncHandler = require("express-async-handler");
const {StatusCodes} = require("http-status-codes");
const {
    addNewBudget,
    getBudgetListDataByPage,
    getBudgetById,
    deleteBudgetById
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
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
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


const getBudgetData = asyncHandler(async (req, res, next) => {
    const userId = res.locals.user.id;
    const budgetId = req.params.id;

    // const budgetDate = await getBudgetById(userId, budgetId);
    //
    // if(budgetDate.hasError) {
    //     throw new NotFoundError(budgetDate.message);
    // }
    //
    // const date = {
    //     month: budgetDate[0].dataValues.month,
    //     year: budgetDate[0].dataValues.year
    // };
    // const category = budgetDate[0].dataValues.category;
    //
    // const budgetData = await getExpensesDataByDate(userId, date, category);

    const budgetData = await getExpensesDataByDate(userId, budgetId);


    if (!budgetData) {
        throw new NotFoundError('Budget not found or no matching expenses found.');
    }


    res.status(StatusCodes.OK).json({budgetData});
});

const deleteBudgetData = async (req, res) => {
    const userId = res.locals.user.id;
    const budgetId = req.params.id;

    const isDeleted = await deleteBudgetById(budgetId, userId);

    if(isDeleted.hasError) {
        throw new InternalServerError(isDeleted.message);
    }

    res.statusCode(StatusCodes.OK).json({message: "Budget deleted successfully"})
}

module.exports = {
    createNewBudget,
    getBudgetListByPage,
    getBudgetData,
    deleteBudgetData
}