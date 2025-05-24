import CardComponent from "../../UI/CardComponent";
import ExpensesElement from "./ExpensesElement";
import PaginationComponent from "../../UI/PaginationComponent";
import {useAutoPageAdjustment} from "../../../utils/hooks/useAutoPageAdjustment";

const ExpensesList = ({expensesList, budgetId, totalPages, currentPage, goToNextExpensesPage, goToPreviousExpensesPage, isBudgetDataFetching, setExpensesPage}) => {
    const list = expensesList.expensesList;

    useAutoPageAdjustment({
        expensesList,
        isBudgetDataFetching,
        currentPage,
        setExpensesPage,
        itemsKey: "expensesList",
    });

    return (
        <CardComponent>
            {list?.length <= 0 && <div>No expenses found</div>}
            {!expensesList.hasError &&
                <table>
                    <tbody>{list.map(el => {
                        return <ExpensesElement
                            key={el.id}
                            id={el.id}
                            source={el.category}
                            amount={el.amount}
                            date={el.date}
                            description={el.description}
                            budgetId={budgetId} />
                    })}
                    </tbody>
                </table>
            }

            <div>
                {totalPages > 1 && <PaginationComponent
                    data={expensesList}
                    currentPage={currentPage}
                    goToNextPage={goToNextExpensesPage}
                    goToPreviousPage={goToPreviousExpensesPage}
                />}
            </div>
        </CardComponent>
    );
}


export default ExpensesList;