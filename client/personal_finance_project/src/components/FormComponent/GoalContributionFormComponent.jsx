import {useFetcher} from "react-router-dom";
import styles from "./Form.module.css";
import {useFormik} from "formik";
import {string, date, object} from "yup";
import Button from "../UI/Button";
import {useEffect} from "react";
import useHandleErrorOrNavigate from "../../utils/error/handleErrorOrNavigate";

let initialValues = {
    amount: "",
    date: ""
}

const yupSchema = object({
    amount: string()
        .test(
            'is-decimal',
            'invalid decimal',
            (value) => value.match(/^\d+(\.\d{1,2})?$/),
        )
        .min(0, "Amount must be greater than zero")
        .required("Amount is required"),
    date: date()
        .required("Date is required"),
})
const GoalContributionFormComponent = (props) => {

    if (props.initialData && Object.keys(props.initialData).length > 0) {
        initialValues = props.initialData;
    } else {
        initialValues = {
            amount: "",
            date: ""
        }
    }
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
        if (fetcher.data?.created) {
            props.closeModal();
        }
    }, [fetcher.data, props]);

    // error handling
    useHandleErrorOrNavigate(fetcher.data);

    return (
        <fetcher.Form
            className={styles.form}
            autoFocus={false}
            method={props.method || "GET"}
            onSubmit={formik.handleSubmit}
            noValidate={true}>

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
                {fetcher.state === "submitting" ? "loading" : "Save"}
            </Button>

        </fetcher.Form>
    );
}

export default GoalContributionFormComponent;