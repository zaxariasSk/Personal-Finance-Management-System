import BudgetList from "../dataComponents/budget/BudgetList";
import {queryClient} from "../../utils/queryClient";
import {redirect, useLoaderData} from "react-router-dom";
import {addNewBudget, fetchBudgetDataByPage} from "../../api/budgetApi";
import {useState} from "react";
import AddBudgetElement from "./AddBudgetElement";
import Button from "../UI/Button";

const BudgetElement = () => {
    const loaderData = useLoaderData();
    console.log(loaderData);
    const [addBudget, setAddBudget] = useState(false);

    const closeAddBudget = () => {
        setAddBudget(false);
    }

    const addBudgetHandler = () => {
        setAddBudget(true);
    }

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
            <BudgetList />

            {/*<BudgetData />*/}
        </section>
    )
}

export default BudgetElement;

export async function loader() {
    const data = queryClient.fetchQuery({
        queryKey: ["budget", 1],
        queryFn: ({signal}) => fetchBudgetDataByPage(1, {signal})
    });

    console.log(data);

    if(data.hasError && data.statusCode === "401") {
        return redirect('/auth');
    }

    return data;
}

export async function action({request}) {
    const formData = await request.formData();
    const budgetData = Object.fromEntries(formData);

    const res = await addNewBudget(budgetData);
    if (res.hasError && res.statusCode === 401) {
        return redirect('/auth');
    }

    await queryClient.invalidateQueries({queryKey: ['budget']});

    return res;
}