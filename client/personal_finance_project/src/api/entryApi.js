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

export const fetchEntryDataByPage = async (page, entryType, {signal}) => {
    try {
        const res = await fetch(`http://localhost:3000/${entryType}?page=${page}`, {
            credentials: "include",
            signal
        });

        if (!res.ok) {
            return await checkError(res);
        }

        return await res.json(); // Return the valid data

    } catch (err) {
        return {
            hasError: true,
            error: "A network error occurred"
        };
    }
};

export const addNewEntry = async (data, entryType) => {
    try {
        const res = await fetch(`http://localhost:3000/${entryType}/add`, {
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
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

export const deleteEntry = async (entryId, entryType, {signal}) => {
    try {
        const res = await fetch(`http://localhost:3000/${entryType}/delete/${entryId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            signal
        });

        if (!res.ok) {
            return await checkError(res);
        }
    } catch (e) {
        console.log(e.message)
        return {
            hasError: true,
            error: "A network error occurred"
        };
    }
}

export const getEntryById = async (entryId, entryType, {signal}) => {
    try {
        const res = await fetch(`http://localhost:3000/${entryType}/edit/${entryId}`, {
            credentials: "include",
            signal
        });

        if (!res.ok) {
            return await checkError(res);
        }

        // Parse and return the JSON data
        return await res.json();
    } catch (e) {
        return {
            hasError: true,
            error: "A network error occurred"
        };
    }
};


export const editEntry = async (entryId, entryType, data) => {
    try {
        const res = await fetch(`http://localhost:3000/${entryType}/edit/${entryId}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            return await checkError(res);
        }

        return await res.json();
    } catch (e) {
        console.log(e.message)
        return {
            hasError: true,
            error: "A network error occurred"
        };
    }
}