import CardComponent from "../UI/CardComponent";
import Button from "../UI/Button";
import AddIncomeElement from "./AddIncomeElement";
import {useState} from "react";


const IncomePage = () => {
    const [addIncomePage, setAddIncomePage] = useState(false);

    const addIncomeHandler = () => {
        setAddIncomePage(true);
    }

    const handleClose = () => {
        setAddIncomePage(false);
    }

    return (
        <>
            {addIncomePage && <AddIncomeElement
                modal={addIncomePage}
                closeModal={handleClose}
            />}
            <h1>Income</h1>

            <Button
                className="plus_button"
                type="submit"
                onClick={addIncomeHandler}
            >
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