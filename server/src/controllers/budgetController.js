const asyncHandler = require("express-async-handler");
const {StatusCodes} = require("http-status-codes");
const {
    addNewBudget,
    getBudgetListDataByPage,
    getBudgetDate
} = require("../services/budgetServices");
const {
    UnprocessableEntityError,
    NotFoundError
} = require("../errors/index");
const {getExpensesDataByDate} = require("../services/expensesServices");

const getBudgetListByPage = asyncHandler( async (req, res) => {
    const userId = res.locals.user.id;
    const page = parseInt(req.body.page) || 1;
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
        budgetData: entries,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
    });
//    TODO: Na balw sto frontend ta nea data me ta page
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


const getBudgetData = async (req, res, next) => {
    const userId = res.locals.user.id;
    const budgetId = req.params.id;

    const month = await getBudgetDate(userId, budgetId);
    const budgetData = await getExpensesDataByDate();

    res.status(200).json({});
}

module.exports = {
    createNewBudget,
    getBudgetListByPage,
    getBudgetData
}