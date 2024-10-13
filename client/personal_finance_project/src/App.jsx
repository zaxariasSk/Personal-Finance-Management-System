import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import store from './redux/store';
import {Provider} from 'react-redux';
import DashboardElement from "./components/DashboardElement/DashboardElement";
import PrivateRoute from "./components/AuthenticationRoute/PrivateRoute";
import AuthPage from "./components/AuthPage/AuthPage";
import EntryPage, {action as addEntryAction, loader as entryPageLoader} from "./components/IncomePage/EntryPage";
import {queryClient} from "./utils/queryClient";
import {QueryClientProvider} from '@tanstack/react-query'
import EditEntryPage, {
    loader as editEntryLoader,
    action as editEntryAction
} from "./components/dataComponents/financeEntry/EditEntryPage";

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
                path: "/entry/:type",
                element: <EntryPage />,
                loader: entryPageLoader,
                action: addEntryAction,
                children: [{
                    path: "edit/:id",
                    element: <EditEntryPage />,
                    loader: editEntryLoader,
                    action: editEntryAction
                }]
            }]
    },
    {
        path: "/auth",
        element: <AuthPage />,
    },
    {
        path: "*",
        element: <Navigate
            to="/dashboard"
            replace={true} />
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
