import {createBrowserRouter, RouterProvider} from "react-router-dom";
import store from './redux/store';
import {Provider} from 'react-redux';
import RootElement from "./components/RootElement/RootElement";
import PrivateRoute from "./components/AuthenticationRoute/PrivateRoute";
import AuthPage, {action as authAction} from "./components/AuthPage/AuthPage";

const router = createBrowserRouter([
    {
        path: '/',
        element: <PrivateRoute><RootElement /></PrivateRoute>,
        children: [{
            path: '/dashboard',
            element: <RootElement />
        }]
    },
    {
        path: '/auth',
        element: <AuthPage />,
        action: authAction
    }

]);


function App() {
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    )
}

export default App;
