const router = require('express').Router();
const isAuth = require("../middleware/isAuth");
const {
    createNewExpenses,
    deleteExpenses,
    editExpenses,
    getExpenses,
    getExpensesByPage
} = require("../controllers/expensesController");
const {check} = require("express-validator");
const {handleValidationErrors} = require('../middleware/validation');

const expenseValidationRules = [
    check('category')
        .isIn(["Beauty", "Bills & Fees", "Car", "Education", "Entertainment", "Family", "Food & Drink", "Groceries", "Healthcare", "Home", "Shopping", "Sports", "Hobbies", "Travel", "Transport", "Work", "Other"])
        .withMessage('Invalid expense category'),
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



router.get('/', isAuth, getExpensesByPage);
router.post('/add', isAuth, expenseValidationRules, handleValidationErrors,  createNewExpenses);
router.delete('/delete/:expenseId', isAuth, deleteExpenses);
router.get('/edit/:expenseId', isAuth, getExpenses);
router.patch('/edit/:expenseId', isAuth, expenseValidationRules, handleValidationErrors, editExpenses);

module.exports = router;