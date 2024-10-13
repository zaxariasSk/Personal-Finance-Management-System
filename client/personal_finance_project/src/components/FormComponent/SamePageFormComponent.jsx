import {useFetcher, useParams} from "react-router-dom";
import Button from "../UI/Button";
import styles from "./Form.module.css"
import {useFormik} from "formik";
import {string, date, object, mixed} from "yup";
import useHandleErrorOrNavigate from "../../utils/error/handleErrorOrNavigate";
import {useEffect} from "react";
// TODO: Na allaksw kai edw to income se entry
const incomeSources = ["Salary", "Business", "Client", "Gifts", "Insurance", "Stocks", "Loan", "Other"];
const expensesSources = ["Beauty", "Bills & Fees", "Car", "Education", "Entertainment", "Family", "Food & Drink", "Groceries", "Healthcare", "Home", "Shopping", "Sports", "Hobbies", "Travel", "Transport", "Work", "Other"];
const combinedSources = incomeSources.concat(expensesSources);

let initialValues = {
    category: "",
    amount: "",
    date: "",
    description: ""
}

let yupSchema = object({
    category: mixed()
        .oneOf(combinedSources)
        .required("Source is required"),
    amount: string()
        .test(
            'is-decimal',
            'invalid decimal',
            (value) => value.match(/^\d+(\.\d{1,2})?$/),
        )
        .min(0, "Amount must be greater than zero")
        .required("Amount is required"),
    date: date().required("Date is required"),
    description: string()
});

const SamePageFormComponent = (props) => {
    const fetcher = useFetcher();
    const {type} = useParams();
    const categories = type === "income" ? incomeSources : expensesSources;

    // check if I already have initialValues
    if (props.initialData && Object.keys(props.initialData).length > 0) {
        initialValues = props.initialData;
    } else {
        initialValues = {
            category: "",
            amount: "",
            date: "",
            description: ""
        }
    }

    const formik = useFormik({
        initialValues,
        validationSchema: yupSchema,
        validateOnChange: false,
        onSubmit: (values) => {
            values.amount = parseFloat(values.amount).toFixed(2);
            fetcher.submit(values, {method: props.method});
        }
    });

    useEffect(() => {
        if (fetcher.data?.newIncome) {
            props.closeModal();
        }
    }, [fetcher.data, props]);

    // error handling
    useHandleErrorOrNavigate(fetcher.data);

    return (
        <fetcher.Form
            autoFocus={false}
            method={props.method}
            className={styles.form}
            onSubmit={formik.handleSubmit}
            noValidate={true}>
            <div>
                <label htmlFor="category">Category</label>
                <select
                    name="category"
                    id="category"
                    value={formik.values.category}
                    onChange={async (e) => {
                        await formik.setFieldValue('category', e.target.value, true);
                    }}
                    onBlur={(e) => formik.setFieldValue('category', e.target.value, true)}
                    className={formik.touched.category && formik.errors.category ? styles.invalid : styles.submit_select}>
                    <option value="">Select a category</option>
                    {categories.map((categoryValue) => (
                        <option
                            key={categoryValue}
                            value={categoryValue}>
                            {categoryValue}
                        </option>
                    ))}
                </select>
                {formik.touched.category && formik.errors.category ? (
                    <div className={styles.errorMessage}>{formik.errors.category}</div>
                ) : null}
            </div>

            <div>
                <label htmlFor="amount">Amount</label>
                <input
                    type="number"
                    name="amount"
                    id="amount"
                    min="0"
                    placeholder="enter your amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.amount && formik.errors.amount ? styles.invalid : ''}
                />

                {formik.touched.amount && formik.errors.amount ? (
                    <div className={styles.errorMessage}>{formik.errors.amount}</div>
                ) : null}
            </div>


            <div>
                <label htmlFor="date">Date</label>
                <input
                    type="date"
                    name="date"
                    id="date"
                    placeholder="enter date"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={(formik.touched.date && formik.errors.date) ? styles.invalid : ''}
                />
                {formik.touched.date && formik.errors.date ? (
                    <div className={styles.errorMessage}>{formik.errors.date}</div>
                ) : null}
            </div>

            <div>
                <label htmlFor="description">Description</label>
                <input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="enter description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={(formik.touched.description && formik.errors.description) ? styles.invalid : ''}
                />
                {formik.touched.description && formik.errors.description ? (
                    <div className={styles.errorMessage}>{formik.errors.description}</div>
                ) : null}
            </div>

            <Button
                type="submit"
                disabled={fetcher.state === "submitting"}>
                {fetcher.state === "submitting" ? "loading" : "Add new income"}
            </Button>
        </fetcher.Form>
    )
}

export default SamePageFormComponent;