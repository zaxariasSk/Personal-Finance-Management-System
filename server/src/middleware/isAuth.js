const {
    verifyJwt,
    signJwt
} = require("../utils/jwtUtil");
const {
    getAccessTokenWithRefreshToken,
    getGoogleUser,
    findAndUpdateUser,
    getUserById,
} = require("../services/userServices");
const {getSessionId} = require("../services/sessionServices");
const {UnauthenticatedError} = require("../errors");
const asyncHandler = require("express-async-handler");

const isAuth = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken && refreshToken) {
        const {
            valid,
            expired,
            decoded
        } = verifyJwt(refreshToken);

        if (valid && !expired) {
            // Use of refresh token to retrieve access_token and id_token
            // TODO: duplicate
            const {
                access_token,
                id_token
            } = await getAccessTokenWithRefreshToken(decoded.refresh_token);

            const googleUser = await getGoogleUser({
                id_token,
                access_token
            });

            const sessionId = await getSessionId(googleUser.id, req.get('user-agent') || '');
            const user = await findAndUpdateUser({email: googleUser.email}, {
                email: googleUser.email,
                name: googleUser.name,
                profilePicture: googleUser.picture,
                googleId: googleUser.id
            }, {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            });

            const accessToken = signJwt({
                ...user.toJSON(),
                session: sessionId
            }, {expiresIn: "10m"});

            res.cookie('accessToken', accessToken, {
                maxAge: 600000, // 10m
                httpOnly: true,
                path: '/',
                sameSite: "lax",
                secure: false
            });
            res.locals.user = user;
            return next();
        } else {
            throw new UnauthenticatedError('No token provided. User session ended. You must login again');
        }
    } else if (accessToken) {
        const {
            valid,
            expired,
            decoded
        } = verifyJwt(accessToken);

        if (!valid || expired) {
            throw new UnauthenticatedError('Invalid or expired access token');
        }

        res.locals.user = await getUserById(decoded.id);

        return next();
    }

    throw new UnauthenticatedError('No token provided. User session ended. You must login again');
});

module.exports = isAuth;