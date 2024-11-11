const router = require('express').Router();
const isAuth = require('../middleware/isAuth');
const {
    createNewBudget,
    getBudgetListByPage,
    getBudgetData
} = require('../controllers/budgetController');

router.get('/', isAuth, getBudgetListByPage);
router.get('/:id', isAuth, getBudgetData);
router.post('/add', isAuth, createNewBudget);

module.exports = router;