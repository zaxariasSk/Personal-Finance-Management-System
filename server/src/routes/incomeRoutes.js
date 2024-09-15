const router = require('express').Router();
const isAuth = require("../middleware/isAuth");
const {getIncome, setNewIncome, deleteIncome} = require("../controllers/incomeController");

router.get('/income', isAuth, getIncome);
router.post('/income/add', isAuth, setNewIncome);
router.delete('/income/delete/:incomeId', isAuth, deleteIncome);

module.exports = router;