import CardComponent from "../UI/CardComponent";
import Button from "../UI/Button";
import AddIncomeElement from "./AddIncomeElement";


const IncomePage = () => {
    let content;

    const addIncomeHandler = () => {
        content = <AddIncomeElement />
    }

    return (
        <>
            {content}
            <h1>Income</h1>

            <Button className="plus_button" type="submit" onClick={addIncomeHandler}>
                +
            </Button>

            <CardComponent>
                <h2>
                    Income history
                </h2>

                <div>
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
                        <tr>

                        </tr>
                        </tbody>
                    </table>
                </div>
            </CardComponent>
        </>
    )
}



export default IncomePage;