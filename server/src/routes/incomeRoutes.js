const router = require('express').Router();
const isAuth = require('../middleware/isAuth');

router.get('/income', isAuth);

module.exports = router;