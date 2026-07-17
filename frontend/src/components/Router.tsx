import { createBrowserRouter } from "react-router-dom"
import { Layout } from "../layout"
import Register from "../pages/Register"
import Login from "../pages/Login"
import ErrorPage from "../pages/ErrorPage"
import HomePage from "../pages/HomePage";
import Product from "../pages/Product";
import ProtectedRoute from "./ProtectedRoute";
import ConfirmationEmail from "../pages/ConfirmationEmail"
import Tarea from "../pages/Task"


export const Router = createBrowserRouter([
    {
        element: <Layout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/productos",
                element: (
                    <ProtectedRoute>
                        <Product />
                    </ProtectedRoute>
                )
            },
            {
                path: "/tareas",
                element: (
                    <ProtectedRoute>
                        <Tarea />
                    </ProtectedRoute>
                )

            },
            {
                path: "confirmar/email",
                element: <ConfirmationEmail />

            }
        ]
    
    }
]);