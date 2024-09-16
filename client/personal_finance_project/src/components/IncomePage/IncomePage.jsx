import CardComponent from "../UI/CardComponent";
import Button from "../UI/Button";
import AddIncomeElement from "./AddIncomeElement";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {addNewIncome, fetchIncome} from "../../api/incomeApi";
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

    const addIncomeHandler = () => {
        setAddIncomePage(true);
    }

    const handleClose = () => {
        setAddIncomePage(false);
    }

    const {data} = useQuery({
        queryKey: ["income"],
        queryFn: ({signal}) => fetchIncome({signal}),
        staleTime: 10000
    });

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
                {/*{data}*/}
                <div>
                    <FinanceEntryComponent data={data}/>
                </div>
            </CardComponent>

            {/* Outlet for nested routes */}
            <Outlet/>
        </>
    )
}


export default IncomePage;

export async function loader() {
    const data = await queryClient.fetchQuery({
        queryKey: ["income"],
        queryFn: ({signal}) => fetchIncome({signal}),
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