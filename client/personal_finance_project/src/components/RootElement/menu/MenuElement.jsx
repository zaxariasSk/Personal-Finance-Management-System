import Button from "../../UI/Button";
import {useDispatch, useSelector} from "react-redux";
import {authActions} from "../../../redux/slices/authSlice";
import {useNavigate} from "react-router-dom";
import ErrorComponent from "../../../utils/error/ErrorComponent";
import {errorActions} from "../../../redux/slices/errorSlice";

const MenuElement = ({children}) => {
    const dispatch = useDispatch();
    const {hasError, message} = useSelector(state => state.error);
    const navigate = useNavigate();

    const logoutHandler = async () => {
        const res = await fetch("http://localhost:3000/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        if (!res.ok) {
            const {message} = await res.json();
            dispatch(errorActions.setError(message));
        }

        dispatch(authActions.logout());

        navigate('/auth');
    }


    return (
        <>
            <header></header>
            <main>
                {hasError && <ErrorComponent message={message}/>}
                <Button onClick={logoutHandler}>
                    Log out
                </Button>
                {children}
            </main>
        </>
    );
}

export default MenuElement;