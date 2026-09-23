import CardComponent from "../../UI/CardComponent";
import {Link, useNavigate} from "react-router-dom";
import Button from "../../UI/Button";
import {useMutation} from "@tanstack/react-query";
import {deleteGoal} from "../../../api/goalsApi";
import {queryClient} from "../../../utils/queryClient";
import {useDispatch} from "react-redux";
import {errorActions} from "../../../redux/slices/errorSlice";
import styles from "./GoalElement.module.css";

const GoalElement = ({
                         id,
                         targetAmount,
                         savedAmount,
                         category
                     }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {mutate} = useMutation({
        mutationFn: async ({id, signal}) => await deleteGoal({id, signal}),
        onSuccess: async (res) => {
            if(res?.statusCode === "401") {
                navigate("/auth");
            }

            await queryClient.invalidateQueries({queryKey: ["goals"]});
        },
        onError: error => dispatch(errorActions.setError({message: error.message}))
    })

    const deleteBudgetHandler = () => {
        const controller = new AbortController();
        const signal = controller.signal;

        mutate({id,signal});
    }

    return (
        <CardComponent>
            <div className={styles.goalCard}>
                <div className={styles.goalHeader}>
                    <h2>{category}</h2>
                    <Link className={styles.contribute} to={`contribution/${id}`} aria-label={`Add contribution to ${category}`}>+</Link>
                </div>
                <div className={styles.goalAmounts}>
                    <p><strong>${Number(savedAmount).toFixed(2)}</strong> saved of ${Number(targetAmount).toFixed(2)}</p>
                    <div className={styles.progressTrack}>
                        <div
                            className={styles.progressBar}
                            style={{width: `${Math.min((savedAmount / targetAmount) * 100, 100)}%`}}
                        />
                    </div>
                </div>
            </div>
            <div className={styles.actions}>
                <div onClick={(e) => e.stopPropagation()}>
                    <Link to={`edit/${id}`}>
                        <img
                            src={"/images/edit.svg"}
                            alt="edit"
                            width="30"
                            height="30"
                            title="Edit" />
                    </Link>
                </div>
                <Button className="icon_button" onClick={deleteBudgetHandler} aria-label={`Delete ${category} goal`}>
                    <img
                        src={'/images/delete.svg'}
                        alt="delete"
                        width="30"
                        height="30"
                        title="delete"
                    />
                </Button>
            </div>
        </CardComponent>
    )
}

export default GoalElement;