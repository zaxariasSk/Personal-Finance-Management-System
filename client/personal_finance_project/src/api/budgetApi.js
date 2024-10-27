const responseErrorHandler = async (res) => {
    if (!res.ok) {
        if (res.status === 401) {
            return {
                hasError: true,
                message: "No token provided",
                statusCode: 401
            }
        }
        const error = await res.json();

        return {
            hasError: true,
            message: error.message || "Something went wrong",
        }
    }
}


export const fetchBudgetDataByPage = async (page, {signal}) => {
    try {
        const res = await fetch(`http://localhost:3000/budget?page=${page}`, {
            credentials: "include",
            signal
        });

        const error = responseErrorHandler(res);
        if(error?.hasError) {
            return error;
        }

        return await res.json();
    } catch (err) {
        return {
            hasError: true,
            error: "A network error occurred"
        };
    }
}

export const addNewBudget = async (data) => {
    try {
        const res = await fetch("http://localhost:3000/budget/add", {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const error = await responseErrorHandler(res);

        if(error?.hasError) {
            return error;
        }
        
        return await res.json();
    } catch (e) {
        return {
            hasError: true,
            error: "A network error occurred"
        };
    }
}
