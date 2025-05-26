import CardComponent from "../UI/CardComponent";
import Button from "../UI/Button";
import AddEntryElement from "./AddEntryElement";
import {useEffect, useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {addNewEntry, fetchEntryDataByPage} from "../../api/entryApi";
import {errorActions} from "../../redux/slices/errorSlice";
import {useDispatch} from "react-redux";
import {queryClient} from "../../utils/queryClient";
import {Outlet, redirect, useLoaderData, useNavigate, useParams} from "react-router-dom";
import FinanceEntryComponent from "../dataComponents/financeEntry/FinanceEntryComponent";
import PaginationComponent from "../UI/PaginationComponent";
import {useAutoPageAdjustment} from "../../utils/hooks/useAutoPageAdjustment";

const EntryPage = () => {
    const {type: entryType} = useParams();
    const navigate = useNavigate();
    const loaderData = useLoaderData();
    const dispatch = useDispatch();
    const [addEntryPage, setAddEntryPage] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    const {data, isFetching} = useQuery({
        queryKey: [entryType, currentPage],
        queryFn: ({signal}) => fetchEntryDataByPage(currentPage, entryType, {signal}),
        staleTime: 10000,
        placeholderData: keepPreviousData
    });

    useAutoPageAdjustment({
        data,
        isFetching,
        currentPage: currentPage,
        setPage: setCurrentPage,
        itemsKey: "data",
    });

    const addEntryHandler = () => {
        setAddEntryPage(true);
    }

    const handleClose = () => {
        setAddEntryPage(false);
    }

    const goToNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, data?.totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

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
                    <FinanceEntryComponent data={data?.data} entryType={entryType} />
                </div>
            </CardComponent>

            {/* Outlet for nested routes */}
            <Outlet />

            {/* Component for pagination */}
            {data?.totalPages > 1 && <PaginationComponent
                data={data}
                currentPage={currentPage}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage} />}
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
        queryFn: async ({signal}) => await fetchEntryDataByPage(1, entryType, {signal}),
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
    const entryType = params.type;
    const formData = await request.formData();
    const entryData = Object.fromEntries(formData);

    const res = await addNewEntry(entryData, entryType);
    await queryClient.invalidateQueries({queryKey: [entryType]});
    return res;
}