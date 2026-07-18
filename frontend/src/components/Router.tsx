import { createBrowserRouter } from "react-router-dom"
import { Layout } from "../layout"
import Register from "../pages/auth/Register"
import Login from "../pages/auth/Login"
import ErrorPage from "../pages/errors/ErrorPage"
import HomePage from "../pages/HomePage";
import Product from "../pages/products/Product";
import CreateProducto from "../pages/products/CreateProducto";
import UpdateProducto from "../pages/products/UpdateProducto";
import ProtectedRoute from "./ProtectedRoute";
import ConfirmationEmail from "../pages/auth/ConfirmationEmail"
import Tarea from "../pages/tasks/Task"


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
                path: "/productos/crear",
                element: (
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <CreateProducto />
                    </ProtectedRoute>
                )
            },
            {
                path: "/productos/actualizar/:idProducto",
                element: (
                    <ProtectedRoute allowedRoles={["Admin"]}>
                        <UpdateProducto />
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
