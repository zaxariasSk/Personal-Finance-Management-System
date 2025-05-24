import Modal from "../../UI/Modal";
import CardComponent from "../../UI/CardComponent";
import {useEffect, useState} from "react";
import {redirect, useActionData, useNavigate, useParams} from "react-router-dom";
import GoalContributionFormComponent from "../../FormComponent/GoalContributionFormComponent";
import {addGoalContribution, fetchGoalContributions} from "../../../api/goalsApi";
import {queryClient} from "../../../utils/queryClient";
import {errorActions} from "../../../redux/slices/errorSlice";
import {useDispatch} from "react-redux";

const GoalContribution = () => {
    const {id: goalId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const actionData = useActionData();

    const closeModal = () => {
        if (!actionData) {
            setIsOpen(false);
            navigate(`/goals`);
        }
    }

    // useEffect(() => {
    //     if (data?.statusCode) {
    //         if (data.statusCode === 401) {
    //             navigate('/auth');
    //         } else {
    //             dispatch(errorActions.setError({message: data.message}));
    //             navigate(`/budget`);
    //         }
    //     }
    // }, [data, dispatch, navigate]);

    return (
        <Modal
            openModal={isOpen}
            closeModal={closeModal}>
            <CardComponent>
                <GoalContributionFormComponent
                    initialData={[]}
                    method={"POST"}
                >

                </GoalContributionFormComponent>
            </CardComponent>
        </Modal>
    )
}

export default GoalContribution;

export async function action({
                                 params,
                                 request
                             }) {
    const goalId = params.id;
    const formData = await request.formData();
    const entryData = Object.fromEntries(formData);

    const res = await addGoalContribution(entryData, goalId);
    await queryClient.invalidateQueries({
        queryKey: ["goalsContributions", goalId]
    });

    if (res.statusCode === 401) {
        return redirect('/auth');
    } else if (res.statusCode) {
        return res;
    }

    return redirect("/goals");
}