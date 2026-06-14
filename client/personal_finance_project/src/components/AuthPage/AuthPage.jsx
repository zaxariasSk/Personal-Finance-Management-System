import getGoogleOAuthURL from "../../utils/getGoogleOAuthURL";
import styles from "./AuthPage.module.css";

const AuthPage = () => {
    return (
        <div className={styles.auth}>
            <div className={styles.container}>
                <h1>Welcome to Personal Finance Manager</h1>
                <p>Take control of your finances with our easy-to-use platform.</p>
                <a href={getGoogleOAuthURL()} className={styles.loginButton}>
                    <img src="/images/google-icon.png" alt="Google" className={styles.googleIcon} />
                    Sign in with Google
                </a>
            </div>
        </div>
    );
}

export default AuthPage;