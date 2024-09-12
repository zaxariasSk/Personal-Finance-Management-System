export const fetchIncome = async ({signal}) => {
    try {
        const res = await fetch('http://localhost:3000/income', {
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
        }; // Handle network errors, etc.
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
