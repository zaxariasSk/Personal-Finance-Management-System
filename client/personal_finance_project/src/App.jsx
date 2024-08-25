import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import store from './redux/store';
import {Provider} from 'react-redux';
import DashboardElement from "./components/DashboardElement/DashboardElement";
import PrivateRoute from "./components/AuthenticationRoute/PrivateRoute";
import AuthPage from "./components/AuthPage/AuthPage";
import IncomePage from "./components/IncomePage/IncomePage";
import AddIncomeElement from "./components/IncomePage/AddIncomeElement";

const router = createBrowserRouter([
    {
        path: '/',
        element: <PrivateRoute />,
        children: [
            {
                index: true,
                element: <Navigate
                    to="/dashboard"
                    replace={true} />,
            },
            {
                path: "/dashboard",
                element: <DashboardElement />
            },
            {
                path: "/income",
                element: <IncomePage />
            }]
    },
    {
        path: "/auth",
        element: <AuthPage />,
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
