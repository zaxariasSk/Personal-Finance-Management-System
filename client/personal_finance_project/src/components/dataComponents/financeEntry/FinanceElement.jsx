import styles from "./FinanceElement.module.css";
import {Link, useNavigate} from "react-router-dom";
import Button from "../../UI/Button";
import {useMutation} from "@tanstack/react-query";
import {deleteIncome} from "../../../api/incomeApi";
import {queryClient} from "../../../utils/queryClient";
import {useDispatch} from "react-redux";
import {errorActions} from "../../../redux/slices/errorSlice";

const FinanceElement = ({
                            id,
                            source,
                            amount,
                            date,
                            description
                        }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {mutate} = useMutation({
        mutationFn: ({id, signal}) => deleteIncome(id, {signal}),
        onSuccess: async (e) => {
            if (e?.statusCode === 401) {
                navigate('/auth');
            }
            await queryClient.invalidateQueries({queryKey: ["income"]});
        },
        onError: error => {
            dispatch(errorActions.setError({message: error.message}));
        }
    });

    const deleteIncomeEntry = () => {
        const controller = new AbortController();
        const signal = controller.signal;

        mutate({id, signal});
    };

    return (
        <>
            <tr className={styles.table_row}>
                <td>{source}</td>
                <td>{amount}</td>
                <td>{date.replaceAll('-', '/')}</td>
                <td>{description || ""}</td>
                <td>
                    <Link to={`edit/${id}`}>
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
                    <Button onClick={deleteIncomeEntry}>
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
        </>
    )
}

export default FinanceElement;
