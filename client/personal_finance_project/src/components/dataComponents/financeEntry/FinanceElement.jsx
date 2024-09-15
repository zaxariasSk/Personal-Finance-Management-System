import styles from "./FinanceElement.module.css";
import {Link} from "react-router-dom";
import Button from "../../UI/Button";
import {useMutation} from "@tanstack/react-query";
import {deleteIncome} from "../../../api/incomeApi";
import {queryClient} from "../../../utils/queryClient";

const FinanceElement = ({
                            id,
                            source,
                            amount,
                            date,
                            description
                        }) => {

    //TODO: Na checkarw ti sumbainei me ta errors
    const {mutate} = useMutation({
        mutationFn: (id) => deleteIncome(id),
        onSuccess: async (e) => {
            console.log(e)
            await queryClient.invalidateQueries({queryKey: ["income"]});
        },
        onError: error => {
            console.log(error)
        }
    });

    const deleteIncomeEntry = () => {
        mutate(id);
    }

    return (
        <>
            <tr className={styles.table_row}>
                <td>{source}</td>
                <td>{amount}</td>
                <td>{date.replaceAll('-', '/')}</td>
                <td>{description || ""}</td>
                <td>
                    <Link to={'/edit'}>
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