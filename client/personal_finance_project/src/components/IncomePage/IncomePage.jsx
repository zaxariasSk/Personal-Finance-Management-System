import CardComponent from "../UI/CardComponent";
import Button from "../UI/Button";
import AddIncomeElement from "./AddIncomeElement";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {addNewIncome, fetchIncomeByPage} from "../../api/incomeApi";
import {errorActions} from "../../redux/slices/errorSlice";
import {useDispatch} from "react-redux";
import {queryClient} from "../../utils/queryClient";
import {Outlet, redirect, useLoaderData, useNavigate} from "react-router-dom";
import FinanceEntryComponent from "../dataComponents/financeEntry/FinanceEntryComponent";

const IncomePage = () => {
    const navigate = useNavigate();
    const loaderData = useLoaderData();

    const dispatch = useDispatch();
    const [addIncomePage, setAddIncomePage] = useState(false);


    // pagination handler
    const [currentPage, setCurrentPage] = useState(1);

    const {data} = useQuery({
        queryKey: ["income", currentPage],
        queryFn: ({signal}) => fetchIncomeByPage(currentPage, {signal}),
        staleTime: 10000,
        keepPreviousData: true
    });

    const addIncomeHandler = () => {
        setAddIncomePage(true);
    }

    const handleClose = () => {
        setAddIncomePage(false);
    }

    useEffect(() => {
        if (loaderData.hasError) {
            dispatch(errorActions.setError({message: loaderData.error}));
        }

        if (data?.hasError) {
            if (data?.statusCode === 401) {
                navigate('/auth');
            } else {
                dispatch(errorActions.setError({message: data.error}));
            }
        }
    }, [data, dispatch, loaderData.hasError, loaderData.error, navigate]);


    return (
        <>
            {/* add income */}
            {addIncomePage && <AddIncomeElement
                modal={addIncomePage}
                closeModal={handleClose}
            />}
            <h1>Income</h1>

            <Button
                className="plus_button"
                type="submit"
                onClick={addIncomeHandler}
            >
                +
            </Button>

            <CardComponent>
                <h2>
                    Income history
                </h2>
                <div>
                    <FinanceEntryComponent data={data?.data} />
                </div>
            </CardComponent>

            {/* Outlet for nested routes */}
            <Outlet />

            {/* Component for pagination */}
            {data?.totalPages &&
                <div>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>{currentPage} of {data?.totalPages}</span>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, data?.totalPages))}
                        disabled={currentPage === data?.totalPages}
                    >
                        Next
                    </button>
                </div>
            }
        </>
    )
}


export default IncomePage;

export async function loader() {
    const data = await queryClient.fetchQuery({
        queryKey: ["income", 1],
        queryFn: ({signal}) => fetchIncomeByPage(1, {signal}),
    });

    if (data.hasError && data.statusCode === 401) {
        return redirect('/auth');
    }
    return data;
}

export async function action({request}) {
    const formData = await request.formData();
    const incomeData = Object.fromEntries(formData);
    const res = await addNewIncome(incomeData);
    await queryClient.invalidateQueries({queryKey: ["income"]});
    return res;
}