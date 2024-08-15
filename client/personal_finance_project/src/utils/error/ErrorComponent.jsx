import {createPortal} from "react-dom";
import {useState} from "react";
import ErrorElement from "./ErrorElement";
import styles from "./error.module.css";

const ErrorComponent = (props) => {
    console.log(props);
    const [showModal, setShowModal] = useState(true);
    setInterval(() => {
        setShowModal(false);
    }, 4000);

    const closeModal = () => {
        setShowModal(false)
    }

    return (
        <div className={styles.error}>
            {showModal && createPortal(
                <ErrorElement onClick={closeModal} message={props.message || "Something went wrong"} />,
                document.getElementById('error-container')
            )}
        </div>
    )
}

export default ErrorComponent;