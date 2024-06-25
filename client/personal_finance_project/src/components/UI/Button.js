import styles from './Button.module.css';

const Button = ({children, ...props}) => {

    return (
        <button
            className={`${styles.button_wrapper}  ${(props.className || '')}`}
            type={props.type || 'button'} {...props}>{children}</button>
    );
}

export default Button;