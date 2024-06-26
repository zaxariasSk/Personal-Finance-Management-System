const {
    NotFoundError,
    ConflictError,
    InternalServerError
} = require('../errors/index');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');


exports.login = asyncHandler(async (req, res) => {
    const userData = req.body;

    const userExists = await User.findOne({where: {email: userData.email}});

    if (!userExists) {
        throw new NotFoundError('This user doesn\'t exist');
    }

    res.status(200).json({message: 'Login successful'});
});

exports.register = asyncHandler(async (req, res) => {
    const user = req.body;

    const userExists = await User.findOne({where: {email: user.email}});

    if (userExists) {
        throw new ConflictError('This user already exists');
    }

    const hashedPassword = bcrypt.hashSync(user.password, saltRounds)

    const newUser = await User.create({
        userName: user.username,
        email: user.email,
        password: hashedPassword
    });

    if (!newUser) {
        throw new InternalServerError('Failed to create a new user. Please try again later');
    }

    res.status(200)
        .json({
            message: 'User created successfully'
        })
});