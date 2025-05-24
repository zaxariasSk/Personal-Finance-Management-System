import {editGoal, getGoalById} from "../../api/goalsApi";
import {queryClient} from "../../utils/queryClient";
import {redirect, useActionData, useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import Modal from "../UI/Modal";
import CardComponent from "../UI/CardComponent";
import GoalFormComponent from "../FormComponent/GoalFormComponent";
import {useEffect, useState} from "react";
import {errorActions} from "../../redux/slices/errorSlice";
import {useDispatch} from "react-redux";

const EditGoalPage = () => {
    const {id: goalId} = useParams();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const actionData = useActionData();

    const closeModal = () => {
        if (!actionData) {
            setIsOpen(false);
            navigate("/goals");
        }
    }

    const {data} = useQuery({
        queryKey: ['goal', {id: goalId}],
        queryFn: ({signal}) => getGoalById(goalId, {signal}),
        staleTime: 10000
    });

    //TODO?: na kanw custom hook gia to use effect?
    useEffect(() => {
        if (data?.statusCode) {
            if (data.statusCode === 401) {
                navigate('/auth');
            } else {
                dispatch(errorActions.setError({message: data.message}));
                navigate(`/budget`);
            }
        }
    }, [data, dispatch, navigate]);

    return (
        <>
            {!data?.hasError &&
                <Modal
                    openModal={isOpen}
                    closeModal={closeModal}
                >
                    <CardComponent>
                        <GoalFormComponent
                            initialData={data?.goalData}
                            method={"PATCH"}>

                        </GoalFormComponent>
                    </CardComponent>
                </Modal>
            }
        </>
    );
}

export default EditGoalPage;

export async function loader({params}) {
    const goalId = params.id;

    const goalData = await queryClient.fetchQuery({
        queryKey: ['goal', {id: goalId}],
        queryFn: ({signal}) => getGoalById(goalId, {signal})
    });

    if (goalData.hasError && goalData.statusCode === 401) {
        return redirect("/auth");
    }

    return goalData;
}

export async function action ({
                                  params,
                                  request
                              }) {
    const goalId = params.id;
    const formData = await request.formData();
    const budgetData = Object.fromEntries(formData);

    const res = await editGoal(goalId, budgetData);
    await queryClient.invalidateQueries({queryKey: ['goal', {id: goalId}]});

    if(res.statusCode === "401") {
        redirect("/auth");
    } else if (res.statusCode) {
        return res;
    }

    return redirect("/goals");
}