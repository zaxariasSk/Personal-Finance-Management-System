import Modal from "../../UI/Modal";
import CardComponent from "../../UI/CardComponent";
import GoalFormComponent from "../../FormComponent/GoalFormComponent";

const AddGoalElement = (props) => {
    return (
        <Modal openModal={props.isOpen} closeModal={props.closeFn}>
            <CardComponent>
                <GoalFormComponent method={"POST"} closeModal={props.closeFn}/>
            </CardComponent>
        </Modal>
    );
}

export default AddGoalElement;