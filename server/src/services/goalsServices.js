const Goal = require("../models/goalModel");
const {InternalServerError} = require("../errors");
const GoalContribution = require("../models/goalContribution");

const getGoalsByPage = async (page, limit, userId) => {
    try {
        const {
            count,
            rows
        } = await Goal.findAndCountAll({
            where: {
                userId,
            },
            // order: ["category", "DESC"],
            offset: (page - 1) * limit,
            limit,
            attributes: {exclude: ['userId', "createdAt", "updatedAt"]}
        });

        if (!count && !rows) {
            return {
                hasError: true,
                message: "No Goals found"
            };
        }

        return {
            rows,
            count
        }
    } catch (e) {
        console.log(e);
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.");
    }
}

const addGoal = async (userId, data) => {
    try {
        const goalExists = await Goal.findOne({
            where: {
                category: data.category
            }
        });

        if (goalExists) {
            return {
                hasError: true,
                message: "A goal for this category already exists"
            }
        }

        const newGoal = await Goal.create({
            userId,
            category: data.category,
            targetAmount: data.targetAmount,
            savedAmount: data.savedAmount
        });

        if (!newGoal) {
            return {
                hasError: true,
                message: "Failed to add a new goal. Please try again later"
            }
        }

        return newGoal;

    } catch (e) {
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.");
    }
}

const deleteGoalById = async (id, userId) => {
    try {
        const res = await Goal.destroy({
            where: {
                userId,
                id
            }
        });

        if (!res) {
            return {
                hasError: true,
                message: "Failed to delete Goal"
            }
        }

        return res;
    } catch (e) {
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.");
    }
}

const getGoalById = async (id, userId) => {
    try {
        const goal = await Goal.findOne({
            where: {
                id,
                userId
            },
            attributes: {exclude: ['userId', "createdAt", "updatedAt"]}
        });

        if (!goal) {
            return {
                hasError: true,
                message: "This Goal doesn't exist"
            }
        }

        return goal;

    } catch (e) {
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.")
    }
}

const updateGoal = async (id, updatedData, userId) => {
    try {
        const [updatedGoal] = await Goal.update(
            updatedData,
            {
                where: {
                    id,
                    userId
                }
            }
        );

        if (updatedGoal <= 0) {
            return {
                hasError: true,
                message: "Failed to update this Goal entry"
            }
        }

        return updatedGoal;
    } catch (e) {
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.")
    }
}

const addNewContribution = async (goalId, data, userId) => {
    try {
        const goalExists = await Goal.findOne({
            where: {
                userId,
                id: goalId
            }
        });
        
        if (!goalExists) {
            return {
                hasError: true,
                message: "Failed to add this contribution"
            }
        }

        const contribution = await GoalContribution.create({
            ...data,
            userId,
            goalId,
        });

        if (!contribution) {
            return {
                hasError: true,
                message: "Failed to add this contribution"
            }
        }

        return contribution;
    } catch (e) {
        console.log(e);
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.")
    }
}

const getGoalsContributionList = async (goalId, userId, limit, page) => {
    try {
        const {
            count,
            rows
        } = await GoalContribution.findAndCountAll({
            where: {
                userId,
                goalId
            },
            offset: (page - 1) * limit,
            limit,
            order: [["date", "DESC"]],
            attributes: {exclude: ['userId', "createdAt", "updatedAt"]},
        });

        if (!count && !rows) {
            return {
                hasError: true,
                message: "No Goal Contribution found"
            };
        }

        return {
            rows,
            count
        }
    } catch (e) {
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.");
    }
}

const removeContributionById = async (id, userId) => {
    try {
        const res = await GoalContribution.destroy({
            where: {
                id,
                userId
            }
        });

        if (!res) {
            return {
                hasError: true,
                message: "Failed to delete Goal"
            }
        }
    } catch (e) {
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.");
    }
}

const getGoalContributionByPk = async (id, userId) => {
    try {
        const contribution = await GoalContribution.findOne({
            where: {
                id,
                userId
            },
            attributes: {exclude: ['userId', "createdAt", "updatedAt"]}
        });

        if (!contribution) {
            return {
                hasError: true,
                message: "Failed to retrieve this goal's contribution"
            }
        }

        return contribution;
    } catch (e) {
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.");
    }
}

const updateContribution = async (id, newData, userId) => {
    try {
        const [updatedContribution] = await GoalContribution.update(
            newData,
            {
                where: {
                    id,
                    userId
                }
            }
        );

        if (updatedContribution <= 0) {
            return {
                hasError: true,
                message: "Failed to update this Contribution entry"
            }
        }

        return updatedContribution;
    } catch (e) {
        throw new InternalServerError("Something went wrong with the server. We are working on it to resolve your problem.");
    }
}

module.exports = {
    getGoalsByPage,
    addGoal,
    deleteGoalById,
    getGoalById,
    updateGoal,
    addNewContribution,
    getGoalsContributionList,
    removeContributionById,
    getGoalContributionByPk,
    updateContribution
}