import CardComponent from "../UI/CardComponent";
import Button from "../UI/Button";
import AddIncomeElement from "./AddIncomeElement";
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getIncome} from "../../api/incomeApi";

const IncomePage = () => {
    const [addIncomePage, setAddIncomePage] = useState(false);

    const addIncomeHandler = () => {
        setAddIncomePage(true);
    }

    const handleClose = () => {
        setAddIncomePage(false);
    }


    const {data} = useQuery({
        queryKey: ["income"],
        queryFn: getIncome
    });

    console.log(data);

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
                {data}
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

export async function loader() {

}

export async function action({
                                 request,
                                 params
                             }) {
    const formData = await request.formData();
    const incomeData = Object.fromEntries(formData);

}