import {createPortal} from "react-dom";
import ErrorElement from "./ErrorElement";
import {useDispatch, useSelector} from "react-redux";
import {errorActions} from "../../redux/slices/errorSlice";
import {useEffect} from "react";

const ErrorComponent = () => {
    const {
        hasError,
        message
    } = useSelector(state => state.error);
    const dispatch = useDispatch();

    useEffect(() => {
        const intervalID = setInterval(() => {
            if(hasError) {
                dispatch(errorActions.clearError())
            }
        }, 4000);

        return () => clearInterval(intervalID);
    }, [dispatch, hasError]);

    const closeModal = () => {
        dispatch(errorActions.clearError())
    }

    return (
        <>
            {hasError && createPortal(
                <ErrorElement
                    onClick={closeModal}
                    message={message} />,
                document.getElementById('error-container')
            )}
        </>
    )
}

export default ErrorComponent;