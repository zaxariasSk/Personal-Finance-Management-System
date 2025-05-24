const responseErrorHandler = async (res) => {
    if (!res.ok) {
        if (res.status === 401) {
            return {
                hasError: true,
                message: "No token provided",
                statusCode: "401"
            }
        }

        const error = await res.json();

        return {
            hasError: true,
            message: error.message || "Something went wrong",
            statusCode: error.statusCode || ""
        }
    }
}

const networkError = {
    hasError: true,
    error: "A network error occurred"
};

export const getAllGoals = async (page, {signal}) => {
    try {
        const res = await fetch(`http://localhost:3000/goal?page=${page}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            signal
        });

        const error = await responseErrorHandler(res);

        if (error?.hasError) {
            return error;
        }
        return await res.json();

    } catch (e) {
        return networkError;
    }
}

export const addNewGoal = async (data) => {
    try {
        const res = await fetch("http://localhost:3000/goal/add", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const error = await responseErrorHandler(res);

        if (error?.hasError) {
            return error;
        }

        return await res.json();
    } catch (e) {
        return networkError;
    }
}

export const deleteGoal = async ({
                                     id,
                                     signal
                                 }) => {
    try {
        const res = await fetch(`http://localhost:3000/goal/delete/${id}`, {
            method: "DELETE",
            credentials: "include",
            signal
        });

        const error = await responseErrorHandler(res);

        if (error?.hasError) {
            return error;
        }

        return await res.json();
    } catch (e) {
        return networkError;
    }
}

export const getGoalById = async (id, {signal}) => {
    try {
        const res = await fetch(`http://localhost:3000/goal/${id}`, {
            credentials: "include",
            signal
        });

        const error = await responseErrorHandler(res);

        if (error?.hasError) {
            return error;
        }

        return await res.json();
    } catch (e) {
        return networkError;
    }
}

export const editGoal = async (id, data) => {
    try {
        const res = await fetch(`http://localhost:3000/goal/edit/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const error = await responseErrorHandler(res);

        if (error?.hasError) {
            return error;
        }

        return await res.json();
    } catch (e) {
        return networkError;
    }
}

export const addGoalContribution = async (data, goalId) => {
    try {
        const res = await fetch(`http://localhost:3000/goal/${goalId}/contribution`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const error = await responseErrorHandler(res);

        if (error?.hasError) {
            return error;
        }

        return await res.json();
    } catch (e) {
        return networkError;
    }
}

export const fetchGoalContributions = async (goalId, page, {signal}) => {

    try {
        const res = await fetch(`http://localhost:3000/goal/${goalId}/contribution?page=${page}`, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            signal
        });

        const error = await responseErrorHandler(res);

        if (error?.hasError) {
            return error;
        }

        return await res.json();
    } catch (e) {
        return networkError;
    }
}

export const deleteGoalContribution = async (id) => {
    try {
        const res = await fetch(`http://localhost:3000/goal/${id}/contribution/`, {
            method: "DELETE",
            credentials: "include"
        });

        const error = await responseErrorHandler(res);

        if (error?.hasError) {
            return error;
        }

        return await res.json();
    } catch (e) {
        return networkError;
    }
}

export const getGoalContributionById = async (id, {signal}) => {
    try {
        const res = await fetch(`http://localhost:3000/goal/contribution/${id}`, {
            credentials: "include",
            signal
        });

        const error = await responseErrorHandler(res);

        if (error?.hasError) {
            return error;
        }

        return await res.json();
    } catch (e) {
        return networkError;
    }
}

export const editContribution = async (id, contributionData) => {
    try {
        const res = await fetch(`http://localhost:3000/goal/contribution/edit/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contributionData)
        });

        const error = await responseErrorHandler(res);

        if (error?.hasError) {
            return error;
        }

        return await res.json();
    } catch (e) {
        return networkError;
    }
}
