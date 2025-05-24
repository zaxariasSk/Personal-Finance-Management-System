const router = require("express").Router();
const isAuth = require("../middleware/isAuth");
const {
    addNewGoal,
    getAllGoalsByPage,
    deleteGoal,
    getGoal,
    editGoal,
    addGoalContribution,
    getGoalContribution,
    deleteGoalContribution,
    getGoalContributionById,
    editContributionById
} = require("../controllers/goalsController");

router.get("/", isAuth, getAllGoalsByPage);
router.get("/:id", isAuth, getGoal);
router.post("/add", isAuth, addNewGoal);
router.delete("/delete/:id", isAuth, deleteGoal);
router.patch("/edit/:id", isAuth, editGoal);

router.post("/:id/contribution", isAuth, addGoalContribution);
router.get("/:id/contribution", isAuth, getGoalContribution);
router.delete("/:id/contribution", isAuth, deleteGoalContribution);
router.get("/contribution/:id", isAuth, getGoalContributionById);
router.patch("/contribution/edit/:id", isAuth, editContributionById);

module.exports = router;