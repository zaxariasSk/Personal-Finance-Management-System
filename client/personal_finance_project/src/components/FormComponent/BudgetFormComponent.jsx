import {useFetcher} from "react-router-dom";
import styles from "./Form.module.css";
import {useFormik} from "formik";
import {string, date, object, mixed} from "yup";
import Button from "../UI/Button";
import {useEffect} from "react";

const categories = ["Beauty", "Bills & Fees", "Car", "Education", "Entertainment", "Family", "Food & Drink", "Groceries", "Healthcare", "Home", "Shopping", "Sports", "Hobbies", "Travel", "Transport", "Work", "Other"];

let initialValues = {
    category: "",
    amount: "",
    date: ""
}

const yupSchema = object({
    category: mixed()
        .oneOf(categories)
        .required("Category is required"),
    amount: string()
        .test(
            'is-decimal',
            'invalid decimal',
            (value) => value.match(/^\d+(\.\d{1,2})?$/),
        )
        .min(0, "Amount must be greater than zero")
        .required("Amount is required"),
    date: date().required("Date is required"),
})

const BudgetFormComponent = (props) => {
    const fetcher = useFetcher();

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
        if(fetcher.data?.created) {
            props.closeModal();
        }
    })

    return (
        <fetcher.Form
            className={styles.form}
            autoFocus={false}
            method={props.method}
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
                    type="month"
                    name="date"
                    id="date"
                    value={formik.values.date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.date && formik.errors.date ? styles.invalid : ''}
                />

                {formik.touched.date && formik.errors.date ? (
                    <div className={styles.errorMessage}>{formik.errors.date}</div>
                ) : null}
            </div>


            <Button
                type="submit"
                disabled={fetcher.state === "submitting"}>
                {fetcher.state === "submitting" ? "loading" : "Add new budget"}
            </Button>

        </fetcher.Form>
    );
}

export default BudgetFormComponent;