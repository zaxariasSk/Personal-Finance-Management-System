import {useCallback} from "react";
import GoalElement from "../dataComponents/goals/GoalElement";
import styles from "./GoalsPage.module.css";

const GoalList = ({goalsData, updateGoalId}) => {
    
    const clicked = useCallback((id) => {
        updateGoalId(id);
    }, [updateGoalId]);

    if (!goalsData || goalsData.length === 0) {
        return <p className={styles.emptyState}>No goals found yet.</p>;
    }

    return (
        <ul className={styles.goalList}>
            {goalsData.map((el) => {
                return (
                    <li
                        key={el.id}
                        onClick={() => clicked(el.id)}>
                        <GoalElement
                            category={el.category}
                            targetAmount={el.targetAmount}
                            savedAmount={el.savedAmount}
                            id={el.id} />
                    </li>
                );
            })}
        </ul>
    )
}

export default GoalList;