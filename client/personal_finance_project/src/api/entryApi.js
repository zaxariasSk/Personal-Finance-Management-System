export const fetchEntryDataByPage = async (page, entryType, {signal}) => {
    try {
        const res = await fetch(`http://localhost:3000/${entryType}?page=${page}`, {
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

export const getEntryById = async (entryId, entryType, {signal}) => {
    const res = await fetch(`http://localhost:3000/${entryType}/edit/${entryId}`, {
        credentials: "include",
        signal
    });

    if (!res.ok) {
        // Handle errors here, throw an error or return an object with the error
        throw new Error(`Error fetching entry: ${res.status}`);
    }

    // Parse and return the JSON data
    return await res.json();
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

        return await res.json();
    } catch (e) {
        console.log(e.message)
        return {
            hasError: true,
            error: "A network error occurred"
        };
    }
}