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
import {action as addBudgetAction, loader as budgetPageLoader} from "./components/BudgetPage/BudgetPage";
import EditBudgetPage, {
    loader as editBudgetLoader,
    action as editBudgetAction
} from "./components/BudgetPage/EditBudgetPage";
import GoalsPage from "./components/GoalsPage/GoalsPage";
import EditGoalPage from "./components/GoalsPage/EditGoalPage";
import GoalContribution from "./components/dataComponents/goals/GoalContribution";
import GoalContributionEdit, {loader} from "./components/dataComponents/goals/GoalContributionEdit";

const BudgetPage = lazy(() => import('./components/BudgetPage/BudgetPage'));
const EditExpensePage = lazy(() => import('./components/BudgetPage/EditExpensePage'));

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
                        <BudgetPage />
                    </Suspense>
                ),
                loader: budgetPageLoader,
                // action: ({request}) => import('./components/BudgetPage/BudgetPage').then(module => module.action({request})),
                action: addBudgetAction,
                children: [{
                    path: "edit/:id",
                    element: <EditBudgetPage />,
                    loader: editBudgetLoader,
                    action: editBudgetAction
                }, {
                    path: "expenses/edit/:id",
                    element: (
                        <Suspense>
                            <EditExpensePage />
                        </Suspense>
                    ),
                    loader: ({params}) => import('./components/BudgetPage/EditExpensePage').then(module => module.loader({params})),
                    action: ({params,request}) => import('./components/BudgetPage/EditExpensePage').then(module => module.action({params, request})),
                }]
            },
            {
                path: "goals",
                element: <GoalsPage />,
                loader: () => import('./components/GoalsPage/GoalsPage').then(module => module.loader()),
                action: ({request}) => import('./components/GoalsPage/GoalsPage').then(module => module.action({request})),
                children: [{
                    path: "edit/:id",
                    element: <EditGoalPage />,
                    loader: ({params}) => import("./components/GoalsPage/EditGoalPage").then(module => module.loader({params})),
                    action: ({params, request}) => import("./components/GoalsPage/EditGoalPage").then(module => module.action({params, request}))
                },
                {
                    path: "contribution/:id",
                    element: <GoalContribution />,
                    action: ({params, request}) => import("./components/dataComponents/goals/GoalContribution").then(module => module.action({params, request}))
                },
                {
                    path: "contribution/edit/:id",
                    element: <GoalContributionEdit />,
                    loader: ({params}) => import("./components/dataComponents/goals/GoalContributionEdit").then(module => module.loader({params})),
                    action: ({params, request}) => import("./components/dataComponents/goals/GoalContributionEdit").then(module => module.action({params, request}))
                }]
            }
        ]
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
