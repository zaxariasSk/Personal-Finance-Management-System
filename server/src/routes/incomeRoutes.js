const router = require('express').Router();
const isAuth = require("../middleware/isAuth");
const {getIncome, setNewIncome} = require("../controllers/incomeController");

router.get('/income', isAuth, getIncome);
router.post('/income/add', isAuth, setNewIncome);

module.exports = router;