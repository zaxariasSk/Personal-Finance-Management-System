import getGoogleOAuthURL from "../../utils/getGoogleOAuthURL";

const AuthPage = () => {

    return (
        <a href={getGoogleOAuthURL()}>
            Login here please
        </a>
    )
}

export default AuthPage;