const router = require('express').Router();
const isAuth = require("../middleware/isAuth");
const {
    createNewIncome,
    deleteIncome,
    editIncome,
    getIncome,
    getIncomeByPage
} = require("../controllers/incomeController");
const {check} = require("express-validator");
const {handleValidationErrors} = require('../middleware/validation');

const incomeValidationRules = [
    check('source')
        .isIn(["Salary", "Business", "Client", "Gifts", "Insurance", "Stocks", "Loan", "Other"])
        .withMessage('Invalid income source'),
    check('amount')
        .isFloat({gt: 0})
        .withMessage('Amount must be greater than zero and a valid decimal'),
    check('date')
        .isDate()
        .withMessage('Date is required and must be in MM-DD-YYYY format'),
    check('description')
        .optional()
        .isString()
        .withMessage('Description must be a string')
];



router.get('/income', isAuth, getIncomeByPage);
router.post('/income/add', isAuth, incomeValidationRules, handleValidationErrors,  createNewIncome);
router.delete('/income/delete/:incomeId', isAuth, deleteIncome);
router.get('/income/edit/:incomeId', isAuth, getIncome);
router.patch('/income/edit/:incomeId', isAuth, incomeValidationRules, handleValidationErrors, editIncome);

module.exports = router;