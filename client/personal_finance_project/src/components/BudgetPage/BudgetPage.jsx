import BudgetList from "../dataComponents/budget/BudgetList";
import {Outlet, redirect, useLoaderData, useNavigate} from "react-router-dom";
import {addNewBudget, fetchBudgetData, fetchBudgetListDataByPage} from "../../api/budgetApi";
import {useEffect, useState} from "react";
import AddBudgetElement from "./AddBudgetElement";
import Button from "../UI/Button";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import PaginationComponent from "../UI/PaginationComponent";
import {errorActions} from "../../redux/slices/errorSlice";
import {useDispatch} from "react-redux";
import ExpensesList from "../dataComponents/budget/ExpensesList";
import styles from "./BudgetPage.module.css";
import {useAutoPageAdjustment} from "../../utils/hooks/useAutoPageAdjustment";
import {queryClient} from "../../utils/queryClient";

const BudgetPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {budgetList} = useLoaderData();
    const [addBudget, setAddBudget] = useState(false);
    const [page, setPage] = useState(1);
    const [expensesPage, setExpensesPage] = useState(1);
    const [budgetId, setBudgetId] = useState(() => {
        const firstBudget = budgetList?.budgetDataList?.[0];
        return firstBudget ? firstBudget.id : 0;
    });

    const {
        data,
        isFetching
    } = useQuery({
        queryKey: ["budget", page],
        queryFn: async ({signal}) => await fetchBudgetListDataByPage(page, {signal}),
        staleTime: 10000,
        placeholderData: keepPreviousData
    });

    useAutoPageAdjustment({
        data,
        isFetching,
        currentPage: page,
        setPage,
        itemsKey: "budgetDataList",
    });

    const {
        data: budgetData,
        isFetching: isBudgetDataFetching
    } = useQuery({
        queryKey: ["budgetExpenses", budgetId, expensesPage],
        queryFn: async ({signal}) => await fetchBudgetData(budgetId, expensesPage, {signal}),
        staleTime: 1000,
        placeholderData: keepPreviousData,
        enabled: data?.budgetDataList?.length > 0
    });

    const budgetIdHandler = (id) => {
        setBudgetId(id);
    }

    const closeAddBudget = () => {
        setAddBudget(false);
    }

    const addBudgetHandler = () => {
        setAddBudget(true);
    }

    const goToNextPage = () => {
        setPage(prevPage => Math.min(prevPage + 1, data?.totalPages));
    }

    const goToPreviousPage = () => {
        setPage(prevPage => Math.max(prevPage - 1, 1));
    }

    const goToNextExpensesPage = () => {
        setExpensesPage(prevPage => Math.min(prevPage + 1, budgetData?.totalPages));
    }

    const goToPreviousExpensesPage = () => {
        setExpensesPage(prevPage => Math.max(prevPage - 1, 1));
    }

    useEffect(() => {
        if (data?.hasError) {
            if (data?.statusCode === 401) {
                navigate('/auth');
            } else {
                dispatch(errorActions.setError({message: data.message}));
            }
        }
    }, [data, dispatch, data.hasError, data.message, navigate]);

    return (
        <>
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
                    closeFn={closeAddBudget}
                />}

                {/* Budget List */}
                <div className={styles['budgetData-budgetList-container']}>
                    <div>
                        <div>
                            <BudgetList
                                getBudgetId={budgetIdHandler}
                                budgetDataList={data.budgetDataList}
                            />
                        </div>
                        <div>
                            {data?.totalPages > 1 && <PaginationComponent
                                data={data}
                                currentPage={page}
                                goToNextPage={goToNextPage}
                                goToPreviousPage={goToPreviousPage}
                            />}
                        </div>
                    </div>

                    {budgetData && <ExpensesList
                        expensesList={budgetData}
                        budgetId={budgetId}
                        currentPage={expensesPage}
                        goToNextExpensesPage={goToNextExpensesPage}
                        goToPreviousExpensesPage={goToPreviousExpensesPage}
                        totalPages={budgetData.totalPages}
                        isBudgetDataFetching={isBudgetDataFetching}
                        setExpensesPage={setExpensesPage}
                    />}
                </div>
            </section>

            <Outlet />
        </>
    )
}

export default BudgetPage;

export async function loader() {
    const budgetList = await queryClient.fetchQuery({
        queryKey: ["budget", 1],
        queryFn: async ({signal}) => await fetchBudgetListDataByPage(1, {signal})
    });

    if (budgetList.hasError && budgetList.statusCode === "401") {
        return redirect('/auth');
    } else if (budgetList.hasError) {
        return {budgetList};
    }

    if (budgetList?.budgetDataList.length <= 0) {
        return {budgetList};
    }

    const budgetData = await queryClient.fetchQuery({
        queryKey: ["budgetExpenses", budgetList?.budgetDataList[0].id, 1],
        queryFn: async ({signal}) => await fetchBudgetData(budgetList?.budgetDataList[0].id, 1, {signal})
    });

    return {
        budgetList,
        budgetData
    };
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