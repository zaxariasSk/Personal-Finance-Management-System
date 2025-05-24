import Button from "../UI/Button";
import {useEffect, useState} from "react";
import AddGoalElement from "../dataComponents/goals/AddGoalElement";
import {addNewGoal, fetchGoalContributions, getAllGoals} from "../../api/goalsApi";
import {Outlet, redirect, useNavigate} from "react-router-dom";
import {queryClient} from "../../utils/queryClient";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import GoalList from "./GoalList";
import PaginationComponent from "../UI/PaginationComponent";
import {errorActions} from "../../redux/slices/errorSlice";
import {useDispatch} from "react-redux";
import GoalContributionList from "../dataComponents/goals/GoalContributionList";
import {useAutoPageAdjustment} from "../../utils/hooks/useAutoPageAdjustment";

const GoalsPage = () => {
    const [addGoal, setAddGoal] = useState(false);
    const [page, setPage] = useState(1);
    const [contributionPage, setContributionPage] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {data: goalsData, isFetching: isGoalsFetching} = useQuery({
        queryKey: ["goals", page],
        queryFn: async ({signal}) => await getAllGoals(page, {signal}),
        staleTime: 10000,
        placeholderData: keepPreviousData
    });

    useAutoPageAdjustment({
        data: goalsData,
        isFetching: isGoalsFetching,
        currentPage: page,
        setPage,
        itemsKey: "goals",
    });

    const [selectedGoalId, setSelectedGoalId] = useState(goalsData.goals[0]?.id);

    const {data: goalContributionsList, isFetching: isContributionsFetching} = useQuery({
        queryKey: ["goalsContributions", selectedGoalId, contributionPage],
        queryFn: async ({signal}) => await fetchGoalContributions(selectedGoalId, contributionPage, {signal}),
        staleTime: 10000,
        placeholderData: keepPreviousData,
        enabled: goalsData?.goals?.length > 0
    });

    const updateGoalId = (id) => {
        setSelectedGoalId(id);
    }

    const closeAddGoal = () => {
        setAddGoal(false);
    }

    const addNewGoalHandler = () => {
        setAddGoal(true);
    }

    const goToNextPage = () => {
        console.log(page);
        setPage(prevPage => Math.min(prevPage + 1, goalsData?.totalPages));
    }

    const goToPreviousPage = () => {
        setPage(prevPage => Math.max(prevPage - 1, 1));
    }

    const goToNextContributionPage = () => {
        setContributionPage(prevPage => Math.min(prevPage + 1, goalContributionsList?.totalPages));
    }

    const goToPreviousContributionPage = () => {
        setContributionPage(prevPage => Math.max(prevPage - 1, 1));
    }

    useEffect(() => {
        if (goalsData?.hasError) {
            if (goalsData.statusCode === 401) {
                navigate('/auth');
            } else {
                dispatch(errorActions.setError({message: goalsData.message}));
            }
        }
    }, [goalsData, dispatch, navigate]);


    return (
        <>
            <section>
                <div>
                    <h1>Goals</h1>
                    <p>The Goals section lets you set and track a financial goal </p>
                </div>

                <Button
                    className="plus_button"
                    type="submit"
                    onClick={addNewGoalHandler}>
                    +
                </Button>

                <div>
                    <GoalList
                        goalsData={goalsData.goals}
                        updateGoalId={updateGoalId} />

                    <div>
                        {goalsData?.totalPages > 1 && <PaginationComponent
                            data={goalsData}
                            currentPage={page}
                            goToNextPage={goToNextPage}
                            goToPreviousPage={goToPreviousPage}
                        />}
                    </div>
                </div>

                {addGoal && <AddGoalElement
                    isOpen={addGoal}
                    closeFn={closeAddGoal} />}

                <GoalContributionList
                    goalContributionsList={goalContributionsList}
                    currentPage={goalContributionsList.currentPage}
                    setPage={setContributionPage}
                    isFetching={isContributionsFetching}
                    goToNextContributionPage={goToNextContributionPage}
                    goToPreviousContributionPage={goToPreviousContributionPage}
                    totalPages={goalContributionsList.totalPages}
                />
            </section>

            <Outlet />
        </>
    );
}

export default GoalsPage;

export async function loader() {
    const page = 1;
    const goalsData = await queryClient.fetchQuery({
        queryKey: ["goals", page],
        queryFn: ({signal}) => getAllGoals(page, {signal})
    });

    if (goalsData.hasError && goalsData.statusCode === "401") {
        return redirect('/auth');
    } else if (goalsData.hasError) {
        return {goalsData};
    }

    const goalContributions = await queryClient.fetchQuery({
        queryKey: ["goalsContributions", goalsData.goals[0].id, page],
        queryFn: async ({signal}) => await fetchGoalContributions(goalsData.goals[0].id, 1, {signal})
    });

    return {
        goalsData,
        goalContributions
    };
}

export async function action({request}) {
    const formData = await request.formData();
    const goalData = Object.fromEntries(formData);

    const res = await addNewGoal(goalData);

    if (res.hasError && res.statusCode === 401) {
        return redirect('/auth');
    }

    await queryClient.invalidateQueries({queryKey: ['goals']});

    return res;
}