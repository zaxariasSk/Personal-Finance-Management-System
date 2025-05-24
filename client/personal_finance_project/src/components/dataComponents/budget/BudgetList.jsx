import BudgetElement from "./BudgetElement";
import {useCallback, memo} from "react";

const BudgetList = memo(({
                        budgetDataList,
                        getBudgetId
                    }) => {

    const clicked = useCallback((id) => {
        getBudgetId(id);
    }, [getBudgetId]);

    if (!budgetDataList || budgetDataList.length === 0) {
        return <p>No Budget found</p>;
    }

    return (
        <ul>
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