import {useSelector} from "react-redux";
import ErrorComponent from "../../utils/error/ErrorComponent";
import Menu from "./menu/Menu";

const PageWrapper = ({children}) => {
    const {
        hasError,
        message
    } = useSelector(state => state.error);


    return (
        <>
            {hasError && <ErrorComponent message={message} />}
            <header>
                <Menu/>
            </header>
            <main>
                {children}
            </main>
        </>
    );
}

export default PageWrapper;