import CardComponent from "../../UI/CardComponent";
import {Link, useNavigate} from "react-router-dom";
import Button from "../../UI/Button";
import {useMutation} from "@tanstack/react-query";
import {deleteGoal} from "../../../api/goalsApi";
import {queryClient} from "../../../utils/queryClient";
import {useDispatch} from "react-redux";
import {errorActions} from "../../../redux/slices/errorSlice";

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
            if(res?.statusCode === 401) {
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
            <div>
                <div>
                    <div>
                        <h2>{category}</h2>
                    </div>
                </div>
                <div>
                    <p>{+savedAmount.toFixed(2)}/{+targetAmount.toFixed(2)}</p>
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
            <div>
                <Link to={`contribution/${id}`}>
                    +
                </Link>
            </div>
        </CardComponent>
    )
}

export default GoalElement;