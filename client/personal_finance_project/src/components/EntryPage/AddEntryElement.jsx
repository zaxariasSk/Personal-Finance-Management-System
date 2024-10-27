import Modal from "../UI/Modal";
import SamePageFormComponent from "../FormComponent/SamePageFormComponent";
import CardComponent from "../UI/CardComponent";

const AddEntryElement = ({
                             modal,
                             closeModal
                         }) => {
    return (
        <Modal
            openModal={modal}
            closeModal={() => closeModal(false)}
        >
            <CardComponent>
                <SamePageFormComponent
                    method="POST"
                    closeModal={() => closeModal(false)} />
            </CardComponent>
        </Modal>
    )
}

export default AddEntryElement;