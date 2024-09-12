import CardComponent from "../UI/CardComponent";
import Button from "../UI/Button";
import AddIncomeElement from "./AddIncomeElement";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {addNewIncome, fetchIncome} from "../../api/incomeApi";
import {errorActions} from "../../redux/slices/errorSlice";
import {useDispatch} from "react-redux";
import {queryClient} from "../../utils/queryClient";
import {redirect, useLoaderData, useNavigate} from "react-router-dom";


const IncomePage = () => {
    const navigate = useNavigate();
    const loaderData = useLoaderData();
    console.log(loaderData);
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

    console.log(data);

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
    }, [data, dispatch]);


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
                    <table>
                        <thead>
                        <tr>
                            <th scope="col">Source</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Date</th>
                            <th scope="col">Description</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>

                        </tr>
                        </tbody>
                    </table>
                </div>
            </CardComponent>
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

export async function action({
                                 request,
                                 params
                             }) {
    const formData = await request.formData();
    const incomeData = Object.fromEntries(formData);
    const res = await addNewIncome(incomeData);
    //TODO: exw error ti kanw?
    await queryClient.invalidateQueries({queryKey: ["income"]});
    return res;
}