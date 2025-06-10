import CardComponent from "../../UI/CardComponent";
import styles from "./BudgetElement.module.css";
import Button from "../../UI/Button";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {queryClient} from "../../../utils/queryClient";
import {errorActions} from "../../../redux/slices/errorSlice";
import {useDispatch} from "react-redux";
import {deleteBudget} from "../../../api/budgetApi";

const BudgetElement = ({
                           category,
                           amount,
                           year,
                           month,
                           id
                       }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {mutate} = useMutation({
        mutationFn: ({id,signal}) => deleteBudget({id,signal}),
        onSuccess: async (res) => {
            if (res?.statusCode === 401) {
                navigate('/auth');
            }
            await queryClient.removeQueries({queryKey: ["budgetExpenses", id], exact: false});
            await queryClient.invalidateQueries({queryKey: ["budget"]})
        },
        onError: error => dispatch(errorActions.setError({message: error.message}))
    })

    const deleteBudgetHandler = async () => {
        const controller = new AbortController();
        const signal = controller.signal;

        mutate({id,signal});
    }

    return (
        <CardComponent>
            <div>
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
            </div>
            <div className={"edit-delete-container"}>
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
                <Button onClick={deleteBudgetHandler}>
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
    );
};

export default BudgetElement;
