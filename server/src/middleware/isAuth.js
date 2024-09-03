const {verifyToken} = require("../controllers/auth/authController");

const isAuth = (req, res, next) => {
    const {
        refreshToken,
        accessToken
    } = req.cookies;

    if (!refreshToken && !accessToken) {
        return res.status(404).redirect('http://localhost:3006/auth');
    }
    console.log('test');

    verifyToken(req, res, next);
}

module.exports = isAuth;