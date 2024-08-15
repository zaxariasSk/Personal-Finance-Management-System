const asyncHandler = require("express-async-handler");
const {
    getGoogleOAuthTokens,
    getGoogleUser,
    findAndUpdateUser,
    getUserById,
    getAccessTokenWithRefreshToken
} = require("../../services/userServices");

const {
    ForbiddenError,
    UnauthenticatedError
} = require('../../errors/index');
const {
    createSession,
    getSessionId,
    deleteSession
} = require('../../services/sessionServices');
const {
    signJwt,
    verifyJwt
} = require("../../utils/jwtUtil");

exports.googleOAuthHandler = asyncHandler(async (req, res) => {
    const code = req.query.code;

    let googleOAuthTokens = getGoogleOAuthTokens({code});
    const {
        id_token,
        refresh_token,
        access_token
    } = await googleOAuthTokens;

    // get user
    const googleUser = await getGoogleUser({
        id_token,
        access_token
    });

    if (!googleUser.verified_email) {
        throw new ForbiddenError('Google account is not verified')
    }

    // TODO: Na kanw check an ginontai update ta stoixeia mou
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

    const session = await createSession(user.id, req.get('user-agent') || '');

    const accessToken = signJwt({
        ...user.toJSON(),
        session: session.id
    }, {expiresIn: "1m"});

    const refreshToken = signJwt(
        {
            refresh_token,
            session: session.id
        },
        {expiresIn: '10m'} // 1 year
    );

    res.cookie('accessToken', accessToken, {
        maxAge: 60000, // 1m
        httpOnly: true,
        path: '/',
        sameSite: "lax",
        secure: false
    });

    res.cookie('refreshToken', refreshToken, {
        maxAge: 600000, // 10m
        httpOnly: true,
        path: '/',
        sameSite: "lax",
        secure: false
    });

    res.status(200).redirect('http://localhost:3006/dashboard');
});

exports.verifyToken = asyncHandler(async (req, res, next) => {
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
            }, {expiresIn: "1m"});

            res.cookie('accessToken', accessToken, {
                maxAge: 60000, // 1m
                httpOnly: true,
                path: '/',
                sameSite: "lax",
                secure: false
            });
            return res.status(200).json({message: "User session updated"});
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

        const user = await getUserById(decoded.id);

        return res.json(user);
    }

    throw new UnauthenticatedError('No token provided. User session ended. You must login again');
});

exports.logout = asyncHandler( async (req, res, next) => {
    return res.status(500).json({message: "Logout false"});
    const {refreshToken} = req.cookies;

    const {valid, expired, decoded} = verifyJwt(refreshToken);
    if(!valid || expired) {
        res.status(200);
    }

    deleteSession(decoded.session);

    res.clearCookie('refreshToken', {path: '/', sameSite: "lax", secure: "false"});
    res.clearCookie('accessToken', {path: '/', sameSite: "lax", secure: "false"});
    res.status(200).json({message: "Logout successfully"});
});