import {useFetcher} from "react-router-dom";
import Button from "../UI/Button";
import styles from "./Form.module.css"

const SamePageFormComponent = () => {
    const fetcher = useFetcher();



    return (
        <fetcher.Form method="POST" className={styles.form}>
            <div>
                <label htmlFor="source">Source</label>
                <input
                    type="text"
                    name="source"
                    id="source"
                    placeholder="enter your income source"
                    required
                />
            </div>

            <div>
                <label htmlFor="amount">Amount</label>
                <input
                    type="number"
                    name="amount"
                    id="amount"
                    min="0"
                    placeholder="enter your amount"
                    required
                />
            </div>


            <div>
                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    name="date"
                    id="date"
                    placeholder="enter date"
                    required
                />
            </div>

            <div>
                <label htmlFor="description">Description</label>
                <input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="enter date"
                />
            </div>

            <Button type="submit">
                Add new income
            </Button>
        </fetcher.Form>
    )
}

export default SamePageFormComponent;