import styles from "./CardComponent.module.css";

const CardComponent = ({children}) => {
    return (
        <div className={styles.card_container}>
            {children}
        </div>
    )
}

export default CardComponent;