import {editBudgetExpense} from "../../api/budgetApi";
import Modal from "../UI/Modal";
import CardComponent from "../UI/CardComponent";
import SamePageFormComponent from "../FormComponent/SamePageFormComponent";
import {useEffect, useState} from "react";
import {redirect, useNavigate, useParams} from "react-router-dom";
import {errorActions} from "../../redux/slices/errorSlice";
import {useDispatch} from "react-redux";
import {queryClient} from "../../utils/queryClient";
import {useQuery} from "@tanstack/react-query";
import {editEntry} from "../../api/entryApi";

const EditExpensePage = () => {
    const {id: expenseId} = useParams();
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const closeModal = () => {
        setIsOpen(false);
        navigate(`/budget`);
    }

    const {data} = useQuery({
        queryKey: ["expense", expenseId],
        queryFn: ({signal}) => editBudgetExpense(expenseId, {signal}),
        staleTime: 10000
    })

    useEffect(() => {
        if (data?.statusCode) {
            if (data.statusCode === 401) {
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
                        <SamePageFormComponent
                            initialData={data}
                            method={"PATCH"}>

                        </SamePageFormComponent>
                    </CardComponent>
                </Modal>
            }
        </>
    )
}

export async function loader({params}) {
    const expenseId = params.id;

    const data = await queryClient.fetchQuery({
        queryKey: ["expense", expenseId],
        queryFn: ({signal}) => editBudgetExpense(expenseId, {signal})
    })

    if (data.hasError && data.statusCode === 401) {
        return redirect('/auth');
    }

    return data;
}

export default EditExpensePage;

export async function action({
                                 params,
                                 request
                             }) {
    const expenseId = params.id;
    const entryType = "expenses";

    const formData = await request.formData();
    const entryData = Object.fromEntries(formData);
    const res = await editEntry(expenseId, entryType, entryData);

    if (res.statusCode === 401) {
        return redirect('/auth');
    } else if (res.statusCode) {
        return res;
    }

    await queryClient.invalidateQueries({queryKey: ["budget"]});

    return redirect(`/budget`);
}