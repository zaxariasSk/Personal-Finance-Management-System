import FinanceElement from "./FinanceElement";

const FinanceEntryComponent = ({data}) => {

    return (
        <table>
            <thead>
            <tr>
                <th scope="col">Source</th>
                <th scope="col">Amount</th>
                <th scope="col">Date</th>
                <th scope="col">Description</th>
            </tr>
            </thead>
            <tbody>
                {data.map((entry) => <FinanceElement key={entry.id} entry={entry} />)}
            </tbody>
        </table>
    )
}

export default FinanceEntryComponent;