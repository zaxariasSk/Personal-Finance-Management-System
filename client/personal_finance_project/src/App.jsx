import {Suspense, lazy} from "react";
import {createBrowserRouter, Navigate, RouterProvider} from "react-router-dom";
import store from './redux/store';
import {Provider} from 'react-redux';
import DashboardElement from "./components/DashboardElement/DashboardElement";
import PrivateRoute from "./components/AuthenticationRoute/PrivateRoute";
import AuthPage from "./components/AuthPage/AuthPage";
import EntryPage, {action as addEntryAction, loader as entryPageLoader} from "./components/EntryPage/EntryPage";
import {queryClient} from "./utils/queryClient";
import {QueryClientProvider} from '@tanstack/react-query'
import EditEntryPage, {
    loader as editEntryLoader,
    action as editEntryAction
} from "./components/dataComponents/financeEntry/EditEntryPage";
import {action as addBudgetAction} from "./components/BudgetPage/BudgetElement";

const BudgetElement = lazy(() => import('./components/BudgetPage/BudgetElement'));
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
            },
            {
                path: "/budget",
                element: (
                    <Suspense>
                        <BudgetElement />
                    </Suspense>
                ),
                // action: () => import('./components/BudgetPage/BudgetElement').then(module => module.action())
                action: addBudgetAction
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
