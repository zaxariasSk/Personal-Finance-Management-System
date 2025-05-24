import CardComponent from "../../UI/CardComponent";
import PaginationComponent from "../../UI/PaginationComponent";
import GoalContributionElement from "./GoalContributionElement";
import {useAutoPageAdjustment} from "../../../utils/hooks/useAutoPageAdjustment";

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
    console.log(totalPages);
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
                <table>
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

            <div>
                {totalPages > 1 && <PaginationComponent
                    data={goalContributionsList}
                    currentPage={currentPage}
                    goToNextPage={goToNextContributionPage}
                    goToPreviousPage={goToPreviousContributionPage}
                />}
            </div>
        </CardComponent>
    );
}

export default GoalContributionList;