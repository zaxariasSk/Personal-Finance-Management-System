import {editContribution, getGoalContributionById} from "../../../api/goalsApi";
import {queryClient} from "../../../utils/queryClient";
import {redirect, useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {errorActions} from "../../../redux/slices/errorSlice";
import {useDispatch} from "react-redux";
import Modal from "../../UI/Modal";
import CardComponent from "../../UI/CardComponent";
import GoalContributionFormComponent from "../../FormComponent/GoalContributionFormComponent";

const GoalContributionEdit = () => {
    const {id: contributionId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);

    const closeModal = () => {
        setIsOpen(false);
        navigate(`/goals`);
    }

    const {data} = useQuery({
        queryKey: ["contribution", contributionId],
        queryFn: ({signal}) => getGoalContributionById(contributionId, {signal}),
        staleTime: 10000
    });

    useEffect(() => {
        if (data?.statusCode) {
            if (data.statusCode === 401) {
                navigate('/auth');
            } else {
                dispatch(errorActions.setError({message: data.message}));
                navigate(`/goals`);
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
                        <GoalContributionFormComponent
                            initialData={data.contribution}
                            method={"PATCH"}>

                        </GoalContributionFormComponent>
                    </CardComponent>
                </Modal>
            }
        </>
    );
}

export default GoalContributionEdit;

export async function loader({params}) {
    const contributionId = params.id;

    const data = await queryClient.fetchQuery({
        queryKey: ["contribution", contributionId],
        queryFn: ({signal}) => getGoalContributionById(contributionId, {signal})
    });

    console.log(data);

    if (data.hasError && data.statusCode === 401) {
        return redirect('/auth');
    }

    return data;
}

export async function action({params, request}) {
    const contributionId = params.id;
    const formData = await request.formData();
    const contributionData = Object.fromEntries(formData);

    const res = await editContribution(contributionId, contributionData);
    await queryClient.invalidateQueries({queryKey: ["contribution", contributionId]});


    if (res.statusCode === 401) {
        return redirect('/auth');
    } else if (res.statusCode) {
        return res;
    }

    return redirect("/goals");
}