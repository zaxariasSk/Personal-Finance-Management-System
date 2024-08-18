import Button from "../../UI/Button";
import {errorActions} from "../../../redux/slices/errorSlice";
import {authActions} from "../../../redux/slices/authSlice";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useRef} from "react";

const ProfileComponent = () => {
    const profileImg = useRef();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector(state => state.auth);

    const logoutHandler = async () => {
        try {
            const res = await fetch("http://localhost:3000/auth/logout", {
                method: "POST",
                credentials: "include"
            });

            if (!res.ok) {
                const error = await res.json();
                dispatch(errorActions.setError(error));
            } else {
                console.log('mpokijinhyvu')
                dispatch(authActions.logout());
            }

            navigate('/auth');
        } catch (e) {
            dispatch(errorActions.setError(e));
        }
    }

    const displayButton = () => {
        profileImg.current.classList.toggle('pressed');
    }

    return (
        <>
            <img
                src={user.profilePicture || 'null'}
                alt={user.name + "'s profile picture"}
                title={user.name}
                width="24"
                height="24"
                onClick={displayButton}
                ref={profileImg}
                onError={({currentTarget}) => {
                    currentTarget.onerror = null;
                    currentTarget.src = "/images/default-profile-picture.png";
                }}
                referrerPolicy="no-referrer" />
            <Button onClick={logoutHandler}>
                Log out
            </Button>
        </>
    )
}

export default ProfileComponent;