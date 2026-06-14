const checkError = async (res) => {
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
            message: error?.message,
            statusCode: error.statusCode || 404
        };
    }
}

export const fetchDashboardSummary = async ({signal}) => {
    try {
        const res = await fetch(`http://localhost:3000/dashboard/summary`, {
            credentials: "include",
            signal
        });

        if (!res.ok) {
            return await checkError(res);
        }

        return await res.json();

    } catch (err) {
        return {
            hasError: true,
            error: "A network error occurred"
        };
    }
};