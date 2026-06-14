const { getDashboardSummary } = require("../services/dashboardServices");

const getDashboardData = async (req, res) => {
    try {
        const user = res.locals.user;
        const summary = await getDashboardSummary(user.id);

        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        console.error('Dashboard controller error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data"
        });
    }
};

module.exports = {
    getDashboardData
};
