import {queryClient} from "../../utils/queryClient";
import {redirect, useActionData, useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import Modal from "../UI/Modal";
import {memo, useEffect, useState} from "react";
import {fetchBudget} from "../../api/budgetApi";
import CardComponent from "../UI/CardComponent";
import BudgetFormComponent from "../FormComponent/BudgetFormComponent";
import {editEntry} from "../../api/entryApi";
import {errorActions} from "../../redux/slices/errorSlice";
import {useDispatch} from "react-redux";

const EditBudgetPage = memo(() => {
    const {id: budgetId} = useParams();
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const actionData = useActionData();

    const closeModal = () => {
        if (!actionData) {
            setIsOpen(false);
            navigate(`/budget`);
        }
    }

    const {data} = useQuery({
        queryKey: ["budget", {id: budgetId}],
        queryFn: ({signal}) => fetchBudget(budgetId, {signal}),
        staleTime: 10000
    });

    useEffect(() => {
        if (data?.statusCode) {
            if (data.statusCode === "401") {
                navigate('/auth');
            } else {
                dispatch(errorActions.setError({message: data.message}));
                navigate(`/budget`);
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
                        <BudgetFormComponent
                            initialData={data?.budgetData[0]}
                            method={"PATCH"}>

                        </BudgetFormComponent>
                    </CardComponent>
                </Modal>
            }
        </>
    )
});

export default EditBudgetPage;

export async function loader({params}) {
    const budgetId = params.id;

    const data = await queryClient.fetchQuery({
        queryKey: ["budget", {id: budgetId}],
        queryFn: ({signal}) => fetchBudget(budgetId, {signal}),
    });

    if (data.hasError && data.statusCode === 401) {
        return redirect('/auth');
    }

    return data;
}

export async function action({
                                 params,
                                 request
                             }) {
    const budgetId = params.id;
    const formData = await request.formData();
    const entryData = Object.fromEntries(formData);
    console.log(entryData);
    // confirm date data update month and year properly
    const date = new Date(entryData.date);
    entryData.month = (date.getMonth() + 1).toString().padStart(2, '0');
    entryData.year = date.getFullYear().toString().padStart(4, '0');

    const res = await editEntry(budgetId, "budget", entryData);
    await queryClient.invalidateQueries({queryKey: ["budget", {id: budgetId}]});

    if (res.statusCode === 401) {
        return redirect('/auth');
    } else if (res.statusCode) {
        return res;
    }

    return redirect(`/budget`);
}