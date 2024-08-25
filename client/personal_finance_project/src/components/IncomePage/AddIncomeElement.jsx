import Modal from "../UI/Modal";
import SamePageFormComponent from "../FormComponent/SamePageFormComponent";
import CardComponent from "../UI/CardComponent";

const AddIncomeElement = ({modal, closeModal}) => {
    return (
        <Modal
            openModal={modal}
            closeModal={() => closeModal(false)}
        >
            <CardComponent>
                <SamePageFormComponent></SamePageFormComponent>
            </CardComponent>
        </Modal>
    )
}

export default AddIncomeElement;