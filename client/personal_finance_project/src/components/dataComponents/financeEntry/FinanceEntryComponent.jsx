import FinanceElement from "./FinanceElement";

const FinanceEntryComponent = ({data}) => {

    if (!data || data.length === 0) {
        return <p>No available income data</p>;
    }

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
            {data.length > 0 && data.map((entry) => {
                return (
                    <FinanceElement
                        key={entry.id}
                        id={entry.id}
                        source={entry.source || entry.category}
                        amount={entry.amount}
                        date={entry.date}
                        description={entry.description}
                    />
                );
            })}
            </tbody>
        </table>
    );
}

export default FinanceEntryComponent;
