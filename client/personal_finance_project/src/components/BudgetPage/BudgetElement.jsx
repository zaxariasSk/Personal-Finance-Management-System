import BudgetList from "../dataComponents/budget/BudgetList";
import {queryClient} from "../../utils/queryClient";
import {redirect, useLoaderData} from "react-router-dom";
import {addNewBudget, fetchBudgetListDataByPage, fetchBudgetData} from "../../api/budgetApi";
import {useEffect, useState} from "react";
import AddBudgetElement from "./AddBudgetElement";
import Button from "../UI/Button";
import {keepPreviousData, useQuery} from "@tanstack/react-query";

const BudgetElement = () => {
    const {budgetList} = useLoaderData();
    const [addBudget, setAddBudget] = useState(false);
    const [page, setPage] = useState(1);
    const [budgetId, setBudgetId] = useState(budgetList?.budgetData[0].id);

    const {data} = useQuery({
        queryKey: ["budget", page],
        queryFn: ({signal}) => fetchBudgetListDataByPage(page, {signal}),
        staleTime: 1000,
        placeholderData: keepPreviousData
    });

    // na trabao ta data tou budget me ola ta expenses pou exo.
    // Na ftiaksw function gia auto, kai sto front end kai sto backend
    const budgetData = useQuery({
        queryKey: ["budget", budgetId],
        queryFn: async ({signal}) => await fetchBudgetData(budgetId, {signal}),
        staleTime: 1000,
        placeholderData: keepPreviousData
    });

    console.log(data);

    const budgetIdHandler = (id) => {
        setBudgetId(id);
    }

    const closeAddBudget = () => {
        setAddBudget(false);
    }

    const addBudgetHandler = () => {
        setAddBudget(true);
    }
useEffect(() => {
    console.log(budgetId);
})
    return (
        <section>
            <div>
                <h1>Budget</h1>
                <p>The budget section lets you choose how much money you want to spend per month in each category </p>
            </div>

            <Button
                className="plus_button"
                type="submit"
                onClick={addBudgetHandler}
            >+
            </Button>

            {addBudget && <AddBudgetElement
                isOpen={addBudget}
                closeFn={closeAddBudget} />}

            {/* Budget List */}
            <BudgetList getBudgetId={budgetIdHandler} budgetDataList={data.budgetData} />

            {/* BudgetData */}
            {/*<BudgetDataElement />*/}
        </section>
    )
}

export default BudgetElement;

export async function loader() {
    const budgetList = await queryClient.fetchQuery({
        queryKey: ["budget", 1],
        queryFn: async ({signal}) => await fetchBudgetListDataByPage(1, {signal})
    });

        console.log(budgetList);
    if (budgetList.hasError && budgetList.statusCode === "401") {
        return redirect('/auth');
    }

    const budgetData = await queryClient.fetchQuery({
        queryKey: ["budget", budgetList?.budgetData[0].id],
        queryFn: async ({signal}) => await fetchBudgetData(budgetList?.budgetData[0].id, {signal})
    });

    return {
        budgetList,
        budgetData
    };
}

export async function action({request}) {
    console.log("it just runs");
    const formData = await request.formData();
    const budgetData = Object.fromEntries(formData);

    const res = await addNewBudget(budgetData);
    if (res.hasError && res.statusCode === 401) {
        return redirect('/auth');
    }

    await queryClient.invalidateQueries({queryKey: ['budget']});

    return res;
}