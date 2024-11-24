const asyncHandler = require("express-async-handler");
const Session = require('../model/sessionModel');
const User = require('../model/userModel');

async function createSession(userId, userAgent) {
    try {
        const sessionExists = await Session.findOne({
            where: {
                userId,
                userAgent: userAgent,
            }
        })

        if (sessionExists) {
            return sessionExists.toJSON();
        }

        const session = await Session.create({
            userId: userId,
            userAgent
        });

        return session.toJSON();
    } catch (e) {
        console.log(e);
    }
}

const getSessionId = asyncHandler(async (googleId, userAgent) => {
    // Find the user by googleId
    const user = await User.findOne({
        where: {
            googleId: googleId
        }
    });

    // If user not found, return null or throw an error
    if (!user) {
        throw new Error('User not found');
    }

    // Find the session by userId and userAgent
    const session = await Session.findOne({
        where: {
            userId: user.id,
            userAgent: userAgent,
            valid: true // Assuming you want only valid sessions
        }
    });

    // If session not found, return null or throw an error
    if (!session) {
        throw new Error('Session not found');
    }

    // Return the session id
    return session.id;

});


const deleteSession = asyncHandler(async (sessionId) => {
    await Session.destroy({
        where: {
            id: sessionId
        }
    });
});


module.exports = {
    createSession,
    getSessionId,
    deleteSession
};


