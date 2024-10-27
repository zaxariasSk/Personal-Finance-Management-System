import Modal from "../UI/Modal";
import CardComponent from "../UI/CardComponent";
import BudgetFormComponent from "../FormComponent/BudgetFormComponent";

const addBudgetElement = (props) => {
    return (
        <Modal openModal={props.isOpen} closeModal={props.closeFn}>
            <CardComponent>
                <BudgetFormComponent method={"POST"} closeModal={props.closeFn}/>
            </CardComponent>
        </Modal>
    );
}

export default addBudgetElement;