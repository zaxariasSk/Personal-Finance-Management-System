import {queryClient} from "../../../utils/queryClient";
import {editEntry, getEntryById} from "../../../api/entryApi";
import {redirect, useActionData, useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import SamePageFormComponent from "../../FormComponent/SamePageFormComponent";
import Modal from "../../UI/Modal";
import {useEffect, useState} from "react";
import CardComponent from "../../UI/CardComponent";
import {useDispatch} from "react-redux";
import {errorActions} from "../../../redux/slices/errorSlice";

const EditEntryPage = () => {
    const {id: entryId, type: entryType} = useParams();
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const actionData = useActionData();

    const closeModal = () => {
        if (!actionData) {
            setIsOpen(false);
            navigate(`/entry/${entryType}`);
        }
    }

    const {data} = useQuery({
        queryKey: [entryType, {id: entryId}],
        queryFn: ({signal}) => getEntryById(entryId, entryType, {signal}),
        staleTime: 10000
    });

    useEffect(() => {
        if (data?.statusCode) {
            if (data.statusCode === "401") {
                navigate('/auth');
            } else {
                dispatch(errorActions.setError({message: data.message}));
                navigate(`/entry/${entryType}`);
            }
        }
    }, [data, dispatch, navigate]);


    return (
        <>
            {!data.hasError &&
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

export default EditEntryPage;

export async function loader({params}) {
    const entryId = params.id;
    const entryType = params?.type || "budget";

    if (entryType !== "income" && entryType !== "expenses") {
        return redirect('/dashboard');
    }

    const data = await queryClient.fetchQuery({
        queryKey: [entryType, {id: entryId}],
        queryFn: ({signal}) => getEntryById(entryId, entryType, {signal}),
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
    const entryId = params.id;
    const entryType = params.type;

    const formData = await request.formData();
    const entryData = Object.fromEntries(formData);
    const res = await editEntry(entryId, entryType, entryData);
    await queryClient.invalidateQueries({queryKey: [entryType]});

    if (res.statusCode === 401) {
        return redirect('/auth');
    } else if (res.statusCode) {
        return res;
    }
    return redirect(`/entry/${entryType}`);
}