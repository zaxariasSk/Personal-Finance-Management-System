const router = require('express').Router();
const loginController = require('../controller/loginController');

router.post('/login', loginController.login);

router.post('/register', loginController.register);


module.exports = router;