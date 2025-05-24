import CardComponent from "../../UI/CardComponent";
import ExpensesElement from "./ExpensesElement";
import PaginationComponent from "../../UI/PaginationComponent";

const ExpensesList = ({expensesList, budgetId, totalPages, currentPage, goToNextExpensesPage, goToPreviousExpensesPage}) => {
    const list = expensesList.expensesList;

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