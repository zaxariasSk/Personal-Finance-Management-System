import styles from './error.module.css';

const ErrorElement = (props) => {

    return (
        <>
            <span onClick={props.onClick}>X</span>
            <p className={styles.error_message}>{props.message}</p>
        </>
    )
}

export default ErrorElement;