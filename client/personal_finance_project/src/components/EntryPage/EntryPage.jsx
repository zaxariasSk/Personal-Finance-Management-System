import CardComponent from "../UI/CardComponent";
import Button from "../UI/Button";
import AddEntryElement from "./AddEntryElement";
import {useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {addNewEntry, fetchEntryDataByPage} from "../../api/entryApi";
import {errorActions} from "../../redux/slices/errorSlice";
import {useDispatch} from "react-redux";
import {queryClient} from "../../utils/queryClient";
import {Outlet, redirect, useLoaderData, useNavigate, useParams} from "react-router-dom";
import FinanceEntryComponent from "../dataComponents/financeEntry/FinanceEntryComponent";

const EntryPage = () => {
    const {type: entryType} = useParams();
    const navigate = useNavigate();
    const loaderData = useLoaderData();

    const dispatch = useDispatch();
    const [addEntryPage, setAddEntryPage] = useState(false);


    // pagination handler
    const [currentPage, setCurrentPage] = useState(1);

    const {data} = useQuery({
        queryKey: [entryType, currentPage],
        queryFn: ({signal}) => fetchEntryDataByPage(currentPage, entryType, {signal}),
        staleTime: 10000,
        keepPreviousData: true
    });

    if(data?.data?.length < 0) {
        setCurrentPage(prevState => prevState - 1);
    }

    const addEntryHandler = () => {
        setAddEntryPage(true);
    }

    const handleClose = () => {
        setAddEntryPage(false);
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
            {/* add entry */}
            {addEntryPage && <AddEntryElement
                modal={addEntryPage}
                closeModal={handleClose}
            />}
            <h1>{entryType}</h1>

            <Button
                className="plus_button"
                type="submit"
                onClick={addEntryHandler}
            >
                +
            </Button>

            <CardComponent>
                <h2>
                    {entryType} history
                </h2>
                <div>
                    <FinanceEntryComponent data={data?.data} />
                </div>
            </CardComponent>

            {/* Outlet for nested routes */}
            <Outlet />

            {/* Component for pagination */}
            {data?.totalPages > 1 &&
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


export default EntryPage;

export async function loader({params}) {
    const entryType = params.type;

    if (entryType !== "income" && entryType !== "expenses") {
        return redirect('/dashboard');
    }

    const data = await queryClient.fetchQuery({
        queryKey: [entryType, 1],
        queryFn: ({signal}) => fetchEntryDataByPage(1, entryType, {signal}),
    });

    if (data.hasError && data.statusCode === 401) {
        return redirect('/auth');
    }
    return data;
}

export async function action({request, params}) {
    const entryType = params.type;
    const formData = await request.formData();
    const entryData = Object.fromEntries(formData);

    const res = await addNewEntry(entryData, entryType);
    await queryClient.invalidateQueries({queryKey: [entryType]});
    return res;
}