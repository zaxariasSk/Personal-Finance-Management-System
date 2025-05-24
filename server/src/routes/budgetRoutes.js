const router = require('express').Router();
const isAuth = require('../middleware/isAuth');
const {
    createNewBudget,
    getBudgetListByPage,
    getBudgetData,
    getBudget,
    deleteBudgetData,
    editBudget
} = require('../controllers/budgetController');
const {
    getExpenses,
    editExpenses
} = require("../controllers/expensesController");
const {handleValidationErrors} = require("../middleware/validation");

router.get('/', isAuth, getBudgetListByPage);
router.get('/:id', isAuth, getBudget);
router.post('/add', isAuth, handleValidationErrors, createNewBudget);
router.delete('/delete/:id', isAuth, deleteBudgetData);
router.patch('/edit/:id', isAuth, handleValidationErrors, editBudget);
router.get('/expenses/edit/:expenseId', isAuth, getExpenses);
router.patch('/expenses/edit/:expenseId', isAuth, handleValidationErrors, editExpenses);
router.get('/expenses/:id', isAuth, getBudgetData);

module.exports = router;