const router = require('express').Router();
const isAuth = require('../middleware/isAuth');
const {createNewBudget} = require('../controllers/budgetController');

router.get('/', isAuth, getBudgetByPage);
router.post('/add', isAuth, createNewBudget);

module.exports = router;