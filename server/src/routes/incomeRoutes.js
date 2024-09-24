const router = require('express').Router();
const isAuth = require("../middleware/isAuth");
const {
    createNewIncome,
    deleteIncome,
    editIncome,
    getIncome,
    getIncomeByPage
} = require("../controllers/incomeController");

router.get('/income', isAuth, getIncomeByPage);
router.post('/income/add', isAuth, createNewIncome);
router.delete('/income/delete/:incomeId', isAuth, deleteIncome);
router.get('/income/edit/:incomeId', isAuth, getIncome);
router.patch('/income/edit/:incomeId', isAuth, editIncome);

module.exports = router;