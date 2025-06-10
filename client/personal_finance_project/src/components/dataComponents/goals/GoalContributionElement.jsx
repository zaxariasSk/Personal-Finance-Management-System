import styles from "../financeEntry/FinanceElement.module.css";
import {Link, useNavigate} from "react-router-dom";
import Button from "../../UI/Button";
import {useMutation} from "@tanstack/react-query";
import {deleteGoalContribution} from "../../../api/goalsApi";
import {queryClient} from "../../../utils/queryClient";
import {errorActions} from "../../../redux/slices/errorSlice";
import {useDispatch} from "react-redux";

const GoalContributionElement = ({
                                     id,
                                     amount,
                                     date,
                                     goalId
                                 }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {mutate} = useMutation({
        mutationFn: (id) => deleteGoalContribution(id),
        onSuccess: async (e) => {
            if (e?.statusCode === "401") {
                navigate('/auth');
            }
            await queryClient.invalidateQueries({queryKey: ["goalsContributions", goalId]});
        },
        onError: error => {
            dispatch(errorActions.setError({message: error.message}));
        }
    });

    const deleteEntryHandler = () => {
        mutate(id);
    }

    return (
        <tr className={styles.table_row}>
            <td>{amount}</td>
            <td>{new Date(date).toLocaleDateString()}</td>
            <td>
                <Link to={`contribution/edit/${id}`}>
                    <img
                        src={'/images/edit.svg'}
                        alt="edit"
                        width="30"
                        height="30"
                        title="Edit"
                    />
                </Link>
            </td>
            <td>
                <Button onClick={deleteEntryHandler}>
                    <img
                        src={'/images/delete.svg'}
                        alt="delete"
                        width="30"
                        height="30"
                        title="delete"
                    />
                </Button>
            </td>
        </tr>
    );
}

export default GoalContributionElement;