const router = require('express').Router();
const isAuth = require('../middleware/isAuth');
const {
    createNewBudget,
    getBudgetListByPage,
    getBudgetData,
    deleteBudgetData
} = require('../controllers/budgetController');

router.get('/', isAuth, getBudgetListByPage);
router.get('/:id', isAuth, getBudgetData);
router.post('/add', isAuth, createNewBudget);
router.delete('/delete/:id', isAuth, deleteBudgetData);

module.exports = router;