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
                <SamePageFormComponent method="POST" closeModal={() => closeModal(false)}
                ></SamePageFormComponent>
            </CardComponent>
        </Modal>
    )
}

export default AddIncomeElement;