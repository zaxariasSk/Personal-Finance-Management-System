import CardComponent from "../UI/CardComponent";
import styles from "./DashboardElement.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardSummary } from "../../api/dashboardApi";
import { useNavigate } from "react-router-dom";

const DashboardElement = () => {
    const navigate = useNavigate();

    const { data: dashboardData, isLoading, error } = useQuery({
        queryKey: ["dashboard"],
        queryFn: async ({ signal }) => await fetchDashboardSummary({ signal }),
        staleTime: 30000, // 30 seconds
    });

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    if (isLoading) {
        return (
            <div className={styles.dashboard}>
                <div className={styles.welcome}>
                    <h1>Welcome to Your Personal Finance Manager</h1>
                    <p>Loading your financial summary...</p>
                </div>
                <div className={styles.stats}>
                    {[1, 2, 3, 4].map((i) => (
                        <CardComponent key={i}>
                            <div className={styles.loading}>Loading...</div>
                        </CardComponent>
                    ))}
                </div>
            </div>
        );
    }

    if (error || dashboardData?.hasError) {
        console.log(error);
        return (
            <div className={styles.dashboard}>
                <div className={styles.welcome}>
                    <h1>Welcome to Your Personal Finance Manager</h1>
                    <p>Unable to load your financial data. Please try again later.</p>
                </div>
            </div>
        );
    }

    const summary = dashboardData?.data || {};

    return (
        <div className={styles.dashboard}>
            <div className={styles.welcome}>
                <h1>Welcome to Your Personal Finance Manager</h1>
                <p>Track your income, expenses, budgets, and goals all in one place.</p>
            </div>
            <div className={styles.stats}>
                <CardComponent>
                    <h3>Total Balance</h3>
                    <p className={`${styles.amount} ${summary.totalBalance >= 0 ? styles.positive : styles.negative}`}>
                        {formatCurrency(summary.totalBalance)}
                    </p>
                </CardComponent>
                <CardComponent>
                    <h3>Monthly Income</h3>
                    <p className={`${styles.amount} ${styles.income}`}>
                        {formatCurrency(summary.monthlyIncome)}
                    </p>
                </CardComponent>
                <CardComponent>
                    <h3>Monthly Expenses</h3>
                    <p className={`${styles.amount} ${styles.expenses}`}>
                        {formatCurrency(summary.monthlyExpenses)}
                    </p>
                </CardComponent>
                <CardComponent>
                    <h3>Active Goals</h3>
                    <p className={styles.amount}>{summary.activeGoals || 0}</p>
                </CardComponent>
            </div>
        </div>
    );
}

export default DashboardElement;