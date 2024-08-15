const fetch = require("node-fetch");
const asyncHandler = require("express-async-handler");
const {
    InternalServerError,
    UnauthenticatedError,
    NotFoundError,
    BadRequestError
} = require("../errors/index");

const User = require('../model/userModel');

/**
 * Asynchronously fetches Google OAuth tokens using an authorization code.
 *
 * @function getGoogleOAuthTokens
 * @async
 *
 * @param {Object} params - An object containing the authorization code.
 * @param {string} params.code - The authorization code obtained from Google OAuth.
 *
 * @returns {Promise<Object>} - A promise that resolves to the Google OAuth tokens.
 *
 * @throws {InternalServerError} - Throws an error if the token request fails.
 *
 * @example
 * // Example usage:
 * const code = req.query.code;
 * const tokens = await getGoogleOAuthTokens({ code });
 */
exports.getGoogleOAuthTokens = asyncHandler(async ({code}) => {
    const url = "https://oauth2.googleapis.com/token";

    const values = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URL,
        grant_type: "authorization_code"
    };

    const qs = new URLSearchParams(values);

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: qs.toString()
    });

    if (!res.ok) {
        const errorMessage = await res.json();
        throw new InternalServerError(errorMessage.error.message || "Failed to fetch Google Oauth tokens");
    }

    return await res.json();
});

exports.getGoogleUser = asyncHandler(async ({
                                                id_token,
                                                access_token
                                            }) => {
    const res = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
        headers: {
            "Authorization": `Bearer ${id_token}`
        }
    });

    if (!res.ok) {
        const errorMessage = await res.json();
        throw new UnauthenticatedError(errorMessage.error.message || "Error fetching Google user");
    }

    return await res.json();
});

exports.getAccessTokenWithRefreshToken = asyncHandler(async (refreshToken) => {
    const url = "https://oauth2.googleapis.com/token";

    const options = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token"
    }

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(options)
    });

    //TODO: Na balw ti na kanei se periptwsh pou den exw refresh token
    if (!res.ok) {
        throw new BadRequestError("No access token returned");
    }

    return await res.json();
});

exports.findAndUpdateUser = asyncHandler(async (query, update, options = {}) => {
    // Find the user by the query criteria
    try {
        let user = await User.findOne({where: query});

        if (user) {
            await User.update(update, {where: query});
        } else {
            user = await User.create({...query, ...update});
        }
        // Update the user with the provided update data
        return user;
    } catch (e) {
        throw new NotFoundError('User not found');
    }

});

/**
 * @param {string} id
 */
exports.getUserById = async (id) => {
    const user = await User.findByPk(id);

    if (!user) {
        throw new NotFoundError('Requested user does not exist');
    }

    return user;
};