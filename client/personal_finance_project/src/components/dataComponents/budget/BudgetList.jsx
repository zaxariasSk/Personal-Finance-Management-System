import BudgetElement from "./BudgetElement";

const BudgetList = ({budgetDataList, getBudgetId}) => {

    const clicked = (id) => {
        getBudgetId(id);
    }

    return (
        <ul>
            {budgetDataList.map((el) => {
                return (
                    <li key={el.id} onClick={() => clicked(el.id)}>
                        <BudgetElement
                            category={el.category}
                            amount={el.amount}
                            month={el.month}
                            year={el.year} />
                    </li>
                );
            })}
        </ul>
    )
}

export default BudgetList;