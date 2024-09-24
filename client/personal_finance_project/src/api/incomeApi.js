export const fetchIncomeByPage = async (page, {signal}) => {
    try {
        const res = await fetch(`http://localhost:3000/income?page=${page}`, {
            credentials: "include",
            signal
        });

        if (!res.ok) {
            if (res.status === 401) {
                return {
                    hasError: true,
                    error: "No token provided",
                    statusCode: 401
                };
            } else {
                const error = await res.json();
                return {
                    hasError: true,
                    error: error?.message
                }; // Return a custom error object or message
            }
        }

        return await res.json(); // Return the valid data

    } catch (err) {
        return {
            hasError: true,
            error: "A network error occurred"
        };
    }
};

export const addNewIncome = async (income) => {
    try {
        const res = await fetch('http://localhost:3000/income/add', {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(income)
        });

        return await res.json();
    } catch (err) {
        return {
            hasError: true,
            error: "A network error occurred"
        };
    }
};

export const deleteIncome = async (incomeId, {signal}) => {
    try {
        const res = await fetch(`http://localhost:3000/income/delete/${incomeId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            signal
        });

        if (!res.ok) {
            if (res.status === 401) {
                return {
                    hasError: true,
                    error: "No token provided",
                    statusCode: 401
                };
            } else {
                const error = await res.json();
                throw new Error(error.message || "This entry could not be deleted. Please try again later");
            }
        }
    } catch (e) {
        console.log(e.message)
        throw new Error(e.message || "This entry could not be deleted. Please try again later")
    }
}

export const getEntryById = async (entryId, {signal}) => {
    const res = await fetch(`http://localhost:3000/income/edit/${entryId}`, {
        credentials: "include",
        signal
    });

    if (!res.ok) {
        // Handle errors here, throw an error or return an object with the error
        throw new Error(`Error fetching entry: ${res.status}`);
    }

    // Parse and return the JSON data
    const data = await res.json();
    return data;
};


export const editIncome = async (incomeId, data) => {
    try {
        const res = await fetch(`http://localhost:3000/income/edit/${incomeId}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return await res.json();
    } catch (e) {
        console.log(e.message)
        return {
            hasError: true,
            error: "A network error occurred"
        };
    }
}