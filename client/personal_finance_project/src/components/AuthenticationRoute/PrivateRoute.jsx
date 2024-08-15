import {Navigate, Outlet} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {fetchUserData} from "../../redux/slices/authSlice";
import MenuElement from "../RootElement/menu/MenuElement";

const PrivateRoute = () => {
    const dispatch = useDispatch();

    const {
        user,
        loading,
        error
    } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user && !loading) {
            dispatch(fetchUserData());
        }

    }, [user, dispatch]);


    if (loading || user === undefined) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <Navigate to="/auth" />;
    }

    return user ? <MenuElement><Outlet /></MenuElement> : <Navigate to="/auth" />;
};

export default PrivateRoute;