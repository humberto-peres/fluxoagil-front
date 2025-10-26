import { lazy, Suspense } from "react";
import {
    createBrowserRouter,
    RouterProvider,
    type RouteObject,
    Navigate
} from "react-router-dom";
import { Protected } from "./Protected";
import PageLoader from "@/components/UI/PageLoader";

const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Dashboardv2 = lazy(() => import("@/pages/Dashboard/DashboardV2"));
const Board = lazy(() => import("@/pages/Board"));
const Backlog = lazy(() => import("@/pages/Backlog"));
const Workspace = lazy(() => import("@/pages/Workspace"));
const Priority = lazy(() => import("@/pages/Priority"));
const Step = lazy(() => import("@/pages/Step"));
const TypeTask = lazy(() => import("@/pages/TypeTask"));
const Team = lazy(() => import("@/pages/Team"));
const User = lazy(() => import("@/pages/Auth/User"));
const Login = lazy(() => import("@/pages/Auth/Login"));
const Configuration = lazy(() => import("@/pages/Configuration"));
const Epic = lazy(() => import("@/pages/Epic"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const About = lazy(() => import("@/pages/About"));
const SignUp = lazy(() => import("@/pages/Auth/SignUp"));
const Task = lazy(() => import("@/pages/Task"));
const TaskDetails  = lazy(() => import("@/pages/Task/TaskDetails"));
const EpicDetails  = lazy(() => import("@/pages/Epic/EpicDetails"));

function withSuspense(el: React.ReactNode, text?: string) {
    return (
        <Suspense fallback={<PageLoader text={text ?? 'Carregando a página…'} />}>
            {el}
        </Suspense>
    );
}

const routes: RouteObject[] = [
    { path: "/", element: withSuspense(<Protected><Navigate to="/dashboard" replace /></Protected>) },

    { path: "/about", element: withSuspense(<About />) },
    { path: "/backlog", element: withSuspense(<Protected><Backlog /></Protected>) },
    { path: "/board", element: withSuspense(<Protected><Board /></Protected>) },
    { path: "/configuration", element: withSuspense(<Protected><Configuration /></Protected>) },
    { path: "/dashboard", element: withSuspense(<Protected><Dashboard /></Protected>) },
    { path: "/epic", element: withSuspense(<Protected><Epic /></Protected>) },
    { path: "/epic/:id", element: withSuspense(<Protected><EpicDetails /></Protected>) },
    { path: "/login", element: withSuspense(<Login />) },
    { path: "/priority", element: withSuspense(<Protected><Priority /></Protected>) },
    { path: "/signup", element: withSuspense(<SignUp />) },
    { path: "/step", element: withSuspense(<Protected><Step /></Protected>) },
    { path: "/task", element: withSuspense(<Protected><Task /></Protected>) },
    { path: "/task/:id", element: withSuspense(<Protected><TaskDetails  /></Protected>) },
    { path: "/type-task", element: withSuspense(<Protected><TypeTask /></Protected>) },
    { path: "/team", element: withSuspense(<Protected><Team /></Protected>) },
    { path: "/user", element: withSuspense(<Protected roles={["admin"]}><User /></Protected>) },
    { path: "/workspace", element: withSuspense(<Protected><Workspace /></Protected>) },
    { path: "*", element: withSuspense(<NotFound />) },
];

const router = createBrowserRouter(routes);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
