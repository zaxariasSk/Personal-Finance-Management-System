import {Form} from "react-router-dom";
import Button from "../UI/Button";
import {useState} from "react";

const AuthPage = () => {
    const [loginState, setLoginState] = useState(true);


    return (
        <Form
            method="post"
            action="/auth"
        >
            <ul>
                <li
                    key={"login"}
                    onClick={() => setLoginState(true)}
                >Login
                </li>
                <li
                    key={"register"}
                    onClick={() => setLoginState(false)}
                >Register
                </li>
            </ul>

            {!loginState &&
                <>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                    />
                </>
            }

            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                name="email"
                required

            />

            <label htmlFor="password">Password:</label>
            <input
                type="password"
                id="password"
                name="password"
                required
            />

            {!loginState &&
                <>
                    <label htmlFor="confirmPassword">Confirm your password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                    />
                </>
            }

            <input
                name='authUrl'
                readOnly
                hidden
                value={loginState ? 'login' : 'register'}
            />

            <div>
                <Button type={"reset"}>Cancel</Button>
                <Button type={"submit"}>Submit</Button>
            </div>
        </Form>
    )
}

export default AuthPage;

export async function action({request}) {
    const formData = await request.formData();
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    })

    console.log(data);

    try {
        const response = await fetch(`http://localhost:3000/${data['authUrl']}`, {
            method: request.method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log(response);
    }
    catch (error) {

    }

    return null
}