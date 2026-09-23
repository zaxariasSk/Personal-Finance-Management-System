import CardComponent from "../../UI/CardComponent";
import PaginationComponent from "../../UI/PaginationComponent";
import GoalContributionElement from "./GoalContributionElement";
import {useAutoPageAdjustment} from "../../../utils/hooks/useAutoPageAdjustment";
import tableStyles from "../financeEntry/FinanceElement.module.css";

const GoalContributionList = ({
                                  goalContributionsList,
                                  currentPage,
                                  goToNextContributionPage,
                                  goToPreviousContributionPage,
                                  totalPages,
                                  setPage,
                                  isFetching
                              }) => {
    const list = goalContributionsList.contributions;
    console.log(goalContributionsList);
    // an exw parapanw elements kai diagrapsw ena me paei sthn prohgoymenh selida alla meta moy exei akoma 2
    useAutoPageAdjustment({
        data: goalContributionsList,
        isFetching,
        currentPage,
        setPage,
        itemsKey: "contributions",
    });

    if (list.length <= 0) {
        return (
            <CardComponent>
                <p>No contribution yet</p>
            </CardComponent>
        )
    }

    return (
        <CardComponent>
            {list.hasError && <div>{list.message}</div>}
            {!list.hasError &&
                <table className={tableStyles.financeTable}>
                    <thead>
                        <tr>
                            <th scope="col">Amount</th>
                            <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>{list.map(el => {
                        return <GoalContributionElement
                            key={el.id}
                            id={el.id}
                            amount={el.amount}
                            date={el.date}
                            goalId={el.goalId}
                        />
                    })}
                    </tbody>
                </table>
            }

            {totalPages > 1 &&<div>
                 <PaginationComponent
                    data={goalContributionsList}
                    currentPage={currentPage}
                    goToNextPage={goToNextContributionPage}
                    goToPreviousPage={goToPreviousContributionPage}
                />
            </div>}
        </CardComponent>
    );
}

export default GoalContributionList;