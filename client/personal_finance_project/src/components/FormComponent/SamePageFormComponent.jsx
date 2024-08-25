import {useFetcher} from "react-router-dom";

const SamePageFormComponent = () => {
    const fetcher = useFetcher();

    return (
        <fetcher.Form
            method="POST"
            action="/income">

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

        </fetcher.Form>
    )
}