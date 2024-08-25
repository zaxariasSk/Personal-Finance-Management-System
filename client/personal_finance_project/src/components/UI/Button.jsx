import styles from './Button.module.css';

const Button = ({children, className, ...props}) => {

    return (
        <button
            className={`${styles.button_wrapper} ${(styles[className] || '')}`}
            type={props.type || 'button'} {...props}>{children}</button>
    );
}

export default Button;