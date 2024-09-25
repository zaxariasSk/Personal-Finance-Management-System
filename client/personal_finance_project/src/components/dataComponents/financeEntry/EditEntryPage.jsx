import {queryClient} from "../../../utils/queryClient";
import {editIncome, getEntryById} from "../../../api/incomeApi";
import {redirect, useActionData, useNavigate, useParams} from "react-router-dom";
import {useQuery} from "@tanstack/react-query";
import SamePageFormComponent from "../../FormComponent/SamePageFormComponent";
import Modal from "../../UI/Modal";
import {useState} from "react";
import CardComponent from "../../UI/CardComponent";

const EditEntryPage = () => {
    const entryId = useParams();
    const [isOpen, setIsOpen] = useState(true);
    const navigate = useNavigate();
    const actionData = useActionData();

    const closeModal = () => {
        if (!actionData) {
            setIsOpen(false);
            navigate("/income");
        }
    }

    const {data} = useQuery({
        queryKey: ["income", {id: entryId.id}],
        queryFn: ({signal}) => getEntryById(entryId.id, {signal}),
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

    const data = await queryClient.fetchQuery({
        queryKey: ["income", {id: entryId}],
        queryFn: ({signal}) => getEntryById(entryId, {signal}),
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
    const formData = await request.formData();
    const incomeData = Object.fromEntries(formData);
    const res = await editIncome(entryId, incomeData);
    await queryClient.invalidateQueries({queryKey: ["income", {id: entryId}]});

    if (res.statusCode === 401) {
        return redirect('/auth');
    } else if (res.statusCode) {
        return res;
    }
    return redirect("/income");
}