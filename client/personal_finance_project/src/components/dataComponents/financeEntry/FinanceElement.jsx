import styles from "./FinanceElement.module.css";

const FinanceElement = ({entry}) => {
    return (
        <>
            <tr className={styles.table_row}>
                <td>{entry.source}</td>
                <td>{entry.amount}</td>
                <td>{entry.date.replaceAll('-', '/')}</td>
                <td>{entry.description || ""}</td>
                <div>

                </div>
            </tr>
        </>
    )
}


export default FinanceElement;