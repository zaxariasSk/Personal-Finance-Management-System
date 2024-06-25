const {} = require('../errors/index');
const bcrypt = require('bcrypt');
const saltRounds = 12;
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');


exports.login = async (req, res) => {
    const userData = req.body;

    try {
        const userExists = await User.findOne({where: {email: userData.email}});

        if (!userExists) {
            return res.status(404)
                      .json({
                          errorMessage: 'This user doesn\'t exist'
                      });
        }


    }
    catch (error) {
        console.log('te');
    }
}

exports.register = async (req, res) => {
    const user = req.body;

    try {
        const userExists = await User.findOne({where: {email: user.email}});

        if (userExists) {
            return res.status(409)
                      .json({
                          errorMessage: 'This user already exists'
                      });
        }

        const hashedPassword = bcrypt.hashSync(user.password, saltRounds)

        const newUser = await User.create({
            userName: user.username,
            email: user.email,
            password: hashedPassword
        });

        if (!newUser) {
            return res.status(500)
                      .json({message: 'oops something went wrong'});
        }

        res.status(200)
           .json({
               message: 'User created successfully'
           })
    }
    catch (error) {
        console.log(error);
    }
}