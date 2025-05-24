import {useFetcher} from "react-router-dom";
import {useFormik} from "formik";
import {mixed, object, string} from "yup";
import {useEffect} from "react";
import useHandleErrorOrNavigate from "../../utils/error/handleErrorOrNavigate";
import styles from "./Form.module.css";
import Button from "../UI/Button";

let initialValues = {
    category: "",
    savedAmount: "",
    targetAmount: ""
}

const yupSchema = object({
    category: mixed()
        .required("Category is required"),
    savedAmount: string()
        .test(
            'is-decimal',
            'invalid decimal',
            (value) => value.match(/^\d+(\.\d{1,2})?$/),
        )
        .min(0, "Amount must be greater than zero")
        .required("Saved Amount is required"),
    targetAmount: string()
        .test(
            'is-decimal',
            'invalid decimal',
            (value) => value.match(/^\d+(\.\d{1,2})?$/),
        )
        .min(0, "Amount must be greater than zero")
        .required("Target Amount is required"),
})

const GoalFormComponent = (props) => {
    if (props.initialData && Object.keys(props.initialData).length > 0) {
        initialValues = props.initialData;
    } else {
        initialValues = {
            category: "",
            savedAmount: "",
            targetAmount: ""
        }
    }

    const fetcher = useFetcher();

    const formik = useFormik({
        initialValues,
        validationSchema: yupSchema,
        validateOnChange: false,
        onSubmit: (values) => {
            values.targetAmount = parseFloat(values.targetAmount).toFixed(2);
            values.savedAmount = parseFloat(values.savedAmount).toFixed(2);
            fetcher.submit(values, {method: props.method});
        }
    });

    useEffect(() => {
        if (fetcher.data?.created) {
            props.closeModal();
        }
    }, [fetcher.data, props]);

    useHandleErrorOrNavigate(fetcher.data);

    return (
        <fetcher.Form
            className={styles.form}
            autoFocus={false}
            method={props.method}
            onSubmit={formik.handleSubmit}
            noValidate={true}>

            <div>
                <label htmlFor="category">Goal's Name</label>
                <input
                    type="text"
                    name="category"
                    id="category"
                    min="0"
                    placeholder="enter your Goal's Name"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.category && formik.errors.category ? styles.invalid : ''}
                />
                {formik.touched.category && formik.errors.category ? (
                    <div className={styles.errorMessage}>{formik.errors.category}</div>
                ) : null}
            </div>

            <div>
                <label htmlFor="targetAmount">Target Amount</label>
                <input
                    type="number"
                    name="targetAmount"
                    id="targetAmount"
                    min="0"
                    placeholder="enter your Target Amount"
                    value={formik.values.targetAmount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.targetAmount && formik.errors.targetAmount ? styles.invalid : ''}
                />

                {formik.touched.targetAmount && formik.errors.targetAmount ? (
                    <div className={styles.errorMessage}>{formik.errors.targetAmount}</div>
                ) : null}
            </div>

            <div>
                <label htmlFor="savedAmount">Saved Amount</label>
                <input
                    type="number"
                    name="savedAmount"
                    id="savedAmount"
                    min="0"
                    placeholder="enter your Saved Amount"
                    value={formik.values.savedAmount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={formik.touched.savedAmount && formik.errors.savedAmount ? styles.invalid : ''}
                />

                {formik.touched.savedAmount && formik.errors.savedAmount ? (
                    <div className={styles.errorMessage}>{formik.errors.savedAmount}</div>
                ) : null}
            </div>


            <Button
                type="submit"
                disabled={fetcher.state === "submitting"}>
                {fetcher.state === "submitting" ? "loading" : "Set new Goal"}
            </Button>

        </fetcher.Form>
    )
}

export default GoalFormComponent;