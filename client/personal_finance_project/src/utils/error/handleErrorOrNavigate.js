import {errorActions} from "../../redux/slices/errorSlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useEffect} from "react";

const useHandleErrorOrNavigate = (error) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (error?.statusCode) {
            if (error.statusCode === 401) {
                navigate('/auth');
            } else {
                dispatch(errorActions.setError({message: error.message}));
            }
        }
    }, [error, dispatch, navigate]);
}

export default useHandleErrorOrNavigate;