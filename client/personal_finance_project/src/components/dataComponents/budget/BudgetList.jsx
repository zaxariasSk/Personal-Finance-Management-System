import BudgetElement from "./BudgetElement";
import {useCallback, memo} from "react";
import styles from "../../BudgetPage/BudgetPage.module.css";

const BudgetList = memo(({
                        budgetDataList,
                        getBudgetId
                    }) => {

    const clicked = useCallback((id) => {
        getBudgetId(id);
    }, [getBudgetId]);

    if (!budgetDataList || budgetDataList.length === 0) {
        return <p className={styles.emptyState}>No budgets found yet.</p>;
    }

    return (
        <ul className={styles.budgetList}>
            {budgetDataList.map((el) => {
                return (
                    <li
                        key={el.id}
                        onClick={() => clicked(el.id)}>
                        <BudgetElement
                            category={el.category}
                            amount={el.amount}
                            month={el.month}
                            year={el.year}
                            id={el.id} />
                    </li>
                );
            })}
        </ul>
    )
});

export default BudgetList;