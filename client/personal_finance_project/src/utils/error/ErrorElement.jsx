import styles from './error.module.css';

const ErrorElement = (props) => {

    return (
        <div className={styles.error}>
            <span onClick={props.onClick}>X</span>
            <p className={styles.error_message}>{props.message}</p>
        </div>
    )
}

export default ErrorElement;