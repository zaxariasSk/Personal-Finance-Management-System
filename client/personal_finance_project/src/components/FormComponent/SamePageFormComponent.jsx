import {useFetcher} from "react-router-dom";
import Button from "../UI/Button";
import styles from "./Form.module.css"
import {useFormik} from "formik";
import {string, date, object} from "yup";

const SamePageFormComponent = () => {
    const fetcher = useFetcher();

    let yupSchema = object({
        source: string()
            .min(3, "Source must contain more than 3 letters")
            .matches(/^[a-zA-Z\s]+$/, "Only alphabetic characters are allowed")
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

    const formik = useFormik({
        initialValues: {
            source: "",
            amount: "",
            date: "",
            description: ""
        },
        validationSchema: yupSchema,
        validateOnChange: false,
        onSubmit: (values) => {
            fetcher.submit(values, {method: "POST"});
        }
    });

    return (
        <fetcher.Form
            method="POST"
            className={styles.form}
            onSubmit={formik.handleSubmit}
            noValidate={true}>
            <div>
                <label htmlFor="source">Source</label>
                <input
                    type="text"
                    name="source"
                    id="source"
                    placeholder="enter your income source"
                    value={formik.values.source}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={(formik.touched.source && formik.errors.source) ? styles.invalid : ''}
                />
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

            <Button type="submit">
                Add new income
            </Button>
        </fetcher.Form>
    )
}

export default SamePageFormComponent;