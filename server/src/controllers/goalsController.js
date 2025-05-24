const asyncHandler = require("express-async-handler");
const {
    addGoal,
    getGoalsByPage,
    deleteGoalById,
    getGoalById,
    updateGoal,
    addNewContribution,
    getGoalsContributionList,
    removeContributionById,
    getGoalContributionByPk,
    updateContribution
} = require("../services/goalsServices");
const {
    UnprocessableEntityError,
    NotFoundError,
    InternalServerError
} = require("../errors");
const {StatusCodes} = require("http-status-codes");

const getAllGoalsByPage = asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const data = await getGoalsByPage(page, limit, userId);

    if (data?.hasError) {
        throw new NotFoundError(data.message);
    }

    const {
        rows: entries,
        count: totalItems
    } = data;

    res.status(StatusCodes.OK).json({
        goals: entries,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
    });
});

const addNewGoal = asyncHandler(async (req, res) => {
    const data = req.body;
    const userId = res.locals.user.id;

    const newGoal = await addGoal(userId, data);

    if (newGoal?.hasError) {
        throw new UnprocessableEntityError(newGoal.message);
    }

    res.status(StatusCodes.CREATED).json({
        created: true,
        message: "New Goal has been created."
    })
});

const deleteGoal = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const userId = res.locals.user.id;

    const isDeleted = await deleteGoalById(id, userId);

    if (isDeleted?.hasError) {
        throw new InternalServerError(isDeleted.message);
    }

    res.status(StatusCodes.OK).json({message: "Goal deleted successfully"});
});

const getGoal = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const userId = res.locals.user.id;

    const goalData = await getGoalById(id, userId);

    if (goalData?.hasError) {
        throw new NotFoundError(goalData.message)
    }

    res.status(StatusCodes.OK).json({goalData});
});

const editGoal = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const userId = res.locals.user.id;
    const updatedData = req.body;

    const updatedGoal = await updateGoal(id, updatedData, userId);

    if (updatedGoal?.hasError) {
        throw new NotFoundError(updatedGoal.message);
    }

    res.status(StatusCodes.OK).json({
        updatedGoal,
        message: "redirect"
    });
});

const addGoalContribution = asyncHandler(async (req, res) => {
    const data = req.body;
    const goalId = req.params.id;
    const userId = res.locals.user.id;

    const newContribution = await addNewContribution(goalId, data, userId);

    if (newContribution?.hasError) {
        throw new UnprocessableEntityError(newContribution.message);
    }

    res.status(StatusCodes.OK).json({
        created: true,
        message: "New Goal Contribution has been created."
    })
});

const getGoalContribution = asyncHandler(async (req, res) => {
    const limit = 5;
    const page = parseInt(req.query.page) || 1;
    const goalId = req.params.id;
    const userId = res.locals.user.id;

    const contributions = await getGoalsContributionList(goalId, userId, limit, page);

    if (contributions?.hasError) {
        throw new NotFoundError(contributions.message);
    }

    const {
        rows: entries,
        count: totalItems
    } = contributions;

    res.status(StatusCodes.OK).json({
        contributions: entries,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
    });
});

const deleteGoalContribution = asyncHandler(async (req, res) => {
    const contributionId = req.params.id;
    const userId = res.locals.user.id;

    const deleted = await removeContributionById(contributionId, userId);


    if (deleted?.hasError) {
        throw new InternalServerError(deleted.message);
    }

    res.status(StatusCodes.OK).json({message: "Goal contribution deleted successfully"});
});

const getGoalContributionById = asyncHandler(async (req, res) => {
    const contributionId = req.params.id;
    const userId = res.locals.user.id;

    const contribution = await getGoalContributionByPk(contributionId, userId);

    if (contribution?.hasError) {
        throw new NotFoundError(contribution.message);
    }

    res.status(StatusCodes.OK).json({contribution});
});

const editContributionById = asyncHandler(async (req, res) => {
    const contributionId = req.params.id;
    const userId = res.locals.user.id;
    const newData = req.body;

    const updatedContribution = await updateContribution(contributionId, newData, userId);

    if (updatedContribution.hasError) {
        throw new NotFoundError(updatedContribution.message);
    }

    res.status(StatusCodes.OK).json({
        updatedContribution,
        message: "redirect"
    });
});


module.exports = {
    getAllGoalsByPage,
    addNewGoal,
    deleteGoal,
    getGoal,
    editGoal,
    addGoalContribution,
    getGoalContribution,
    deleteGoalContribution,
    getGoalContributionById,
    editContributionById
}