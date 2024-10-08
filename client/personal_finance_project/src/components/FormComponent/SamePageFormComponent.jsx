import {useFetcher, useNavigate} from "react-router-dom";
import Button from "../UI/Button";
import styles from "./Form.module.css"
import {useFormik} from "formik";
import {string, date, object, mixed} from "yup";
import useHandleErrorOrNavigate from "../../utils/error/handleErrorOrNavigate";
import {useEffect} from "react";

const incomeSources = ["Salary", "Business", "Client", "Gifts", "Insurance", "Stocks", "Loan", "Other"];
let initialValues = {
    source: "",
    amount: "",
    date: "",
    description: ""
}

let yupSchema = object({
    source: mixed()
        .oneOf(incomeSources)
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

    // check if I already have initialValues
    if (props.initialData && Object.keys(props.initialData).length > 0) {
        initialValues = props.initialData;
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
            method="POST"
            className={styles.form}
            onSubmit={formik.handleSubmit}
            noValidate={true}>
            <div>
                <label htmlFor="source">Source</label>
                <select
                    name="source"
                    id="source"
                    value={formik.values.source}
                    onChange={(e) => {
                        formik.setFieldValue('source', e.target.value, true);
                    }}
                    onBlur={formik.handleBlur}
                    className={formik.touched.source && formik.errors.source ? styles.invalid : styles.submit_select}>
                    <option value="">Select a source</option>
                    {incomeSources.map((sourceValue) => (
                        <option
                            key={sourceValue}
                            value={sourceValue}>
                            {sourceValue}
                        </option>
                    ))}
                </select>
                {formik.touched.source && formik.errors.source ? (
                    <div className={styles.errorMessage}>{formik.errors.source}</div>
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