import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import store from './redux/store';
import {Provider} from 'react-redux';
import DashboardElement from "./components/DashboardElement/DashboardElement";
import PrivateRoute from "./components/AuthenticationRoute/PrivateRoute";
import AuthPage from "./components/AuthPage/AuthPage";
import IncomePage, {action as addIncomeAction, loader as incomePageLoader} from "./components/IncomePage/IncomePage";
import {queryClient} from "./utils/queryClient";
import {QueryClientProvider} from '@tanstack/react-query'

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
                element: <IncomePage />,
                loader: incomePageLoader,
                action: addIncomeAction
            }]
    },
    {
        path: "/auth",
        element: <AuthPage />,
    },
    {
        path: "*",
        element: <Navigate to="/dashboard" replace={true} />
    }

]);


function App() {
    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={router} />
            </QueryClientProvider>
        </Provider>
    );
}

export default App;
