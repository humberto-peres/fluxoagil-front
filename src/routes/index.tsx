import { lazy, Suspense } from "react";
import {
    createBrowserRouter,
    RouterProvider,
    type RouteObject,
} from "react-router-dom";
import { Protected } from "./Protected";
import Epic from "@/pages/Epic/Epic";

const Dashboard = lazy(() => import("@/pages/Dashboard/Dashboard"));
const Board = lazy(() => import("@/pages/Board/Board"));
const Backlog = lazy(() => import("@/pages/Backlog/Backlog"));
const Workspace = lazy(() => import("@/pages/Workspace/Workspace"));
const Priority = lazy(() => import("@/pages/Priority/Priority"));
const Step = lazy(() => import("@/pages/Step/Step"));
const TypeTask = lazy(() => import("@/pages/TypeTask/TypeTask"));
const Team = lazy(() => import("@/pages/Team/Team"));
const User = lazy(() => import("@/pages/Auth/User/User"));
const Login = lazy(() => import("@/pages/Auth/Login/Login"));
const ForgotPassword = lazy(() => import("@/pages/Auth/ForgotPassword/ForgotPassword"));
const Configuration = lazy(() => import("@/pages/Configuration/Configuration"));

function withSuspense(el: React.ReactNode) {
    return <Suspense fallback={<div style={{ padding: 24 }}>Carregando…</div>}>{el}</Suspense>;
}

const routes: RouteObject[] = [
    { path: "/", element: withSuspense(<Protected><Dashboard /></Protected>) },
    { path: "/board", element: withSuspense(<Protected><Board /></Protected>) },
    { path: "/backlog", element: withSuspense(<Protected><Backlog /></Protected>) },
    { path: "/epic", element: withSuspense(<Protected><Epic /></Protected>) },
    { path: "/workspace", element: withSuspense(<Protected><Workspace /></Protected>) },
    { path: "/priority", element: withSuspense(<Protected><Priority /></Protected>) },
    { path: "/step", element: withSuspense(<Protected><Step /></Protected>) },
    { path: "/type-task", element: withSuspense(<Protected><TypeTask /></Protected>) },
    { path: "/team", element: withSuspense(<Protected><Team /></Protected>) },
    { path: "/user", element: withSuspense(<Protected roles={["admin"]}><User /></Protected>) },
    { path: "/login", element: withSuspense(<Login />) },
    { path: "/forgot-password", element: withSuspense(<ForgotPassword />) },
    { path: "/configuration", element: withSuspense(<Protected><Configuration /></Protected>) },
    { path: "*", element: <div style={{ padding: 24 }}>Página não encontrada</div> }
];

const router = createBrowserRouter(routes);

export function AppRouter() {
    return <RouterProvider router={router} />;
}
