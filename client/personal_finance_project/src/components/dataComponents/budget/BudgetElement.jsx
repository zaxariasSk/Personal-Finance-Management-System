import CardComponent from "../../UI/CardComponent";
import styles from "./BudgetElement.module.css";

const BudgetElement = ({
                           category,
                           amount,
                           year,
                           month
                       }) => {
    return (
        <CardComponent>
            <div className={styles.budget__container}>
                <div className="budget-element">
                    <div className="budget-element__category">
                        <h2>{category}</h2>
                    </div>

                </div>
                <div className="budget-element__date">
                    <p>{month}/{year}</p>
                    <div className="budget-element__amount">
                        <p>${amount.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </CardComponent>
    );
};

export default BudgetElement;
