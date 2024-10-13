import {queryClient} from "../../../utils/queryClient";
import {editEntry, getEntryById} from "../../../api/entryApi";
import {redirect, useActionData, useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import SamePageFormComponent from "../../FormComponent/SamePageFormComponent";
import Modal from "../../UI/Modal";
import {useState} from "react";
import CardComponent from "../../UI/CardComponent";

const EditEntryPage = () => {
    const {id: entryId, type: entryType} = useParams();

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
        queryFn: ({signal}) => getEntryById(entryId, entryType,{signal}),
        staleTime: 10000
    });

    return (
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
    )
}

export default EditEntryPage;

export async function loader({params}) {
    const entryId = params.id;
    const entryType = params.type;

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