import styles from "../financeEntry/FinanceElement.module.css";
import {Link, useNavigate} from "react-router-dom";
import Button from "../../UI/Button";
import {useMutation} from "@tanstack/react-query";
import {deleteEntry} from "../../../api/entryApi";
import {queryClient} from "../../../utils/queryClient";
import {useDispatch} from "react-redux";
import {errorActions} from "../../../redux/slices/errorSlice";

const ExpensesElement = ({
                             id,
                             source,
                             amount,
                             date,
                             description,
                             budgetId
                         }) => {
    const entryType = "expenses";

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {mutate} = useMutation({
        mutationFn: ({
                         id,
                         entryType,
                         signal
                     }) => deleteEntry(id, entryType, {signal}),
        onSuccess: async (e) => {
            if (e?.statusCode === 401) {
                navigate('/auth');
            }
            await queryClient.invalidateQueries({queryKey: ["budgetExpenses", budgetId]});
        },
        onError: error => {
            dispatch(errorActions.setError({message: error.message}));
        }
    });

    const deleteEntryHandler = () => {
        const controller = new AbortController();
        const signal = controller.signal;

        mutate({id, entryType, signal});
    };

    return (
        <tr className={styles.table_row}>
            <td>{source}</td>
            <td>{amount}</td>
            <td>{new Date(date).toLocaleDateString()}</td>
            <td>{description || ""}</td>
            <td>
                <Link to={`expenses/edit/${id}`}>
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
    )
}

export default ExpensesElement;
