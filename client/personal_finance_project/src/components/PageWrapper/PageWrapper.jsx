import {useSelector} from "react-redux";
import ErrorComponent from "../../utils/error/ErrorComponent";
import Menu from "./menu/Menu";
import styles from "./PageWrapper.module.css";

const PageWrapper = ({children}) => {
    const {
        hasError,
        message
    } = useSelector(state => state.error);

    return (
        <>
            {hasError && <ErrorComponent message={message} />}
            <header className={styles.header}>
                <Menu/>
            </header>
            <main className={styles.main}>
                {children}
            </main>
        </>
    );
}

export default PageWrapper;