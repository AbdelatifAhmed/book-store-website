import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Layout from "../pages/Layout/Layout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Books from "../pages/Books/Books";
import AdminRoute from "../components/Admin/AdminRoute";
import AdminDashboard from "../components/Admin/AdminDashboard";
import AddBook from "../components/Admin/AddBook";
import UpdateBook from "../components/Admin/UpdateBook";
import BookDetails from "../pages/Books/BookDetails";
import MyOrders from "../pages/orders/Myorder";
const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "books",
                element: <Books />
            },
            { path: "books/:id", element: <BookDetails /> },
            { path: "my-orders", element: <MyOrders /> },
            {
                path: "admin",
                element: <AdminRoute />,
                children: [
                    {
                        path: "dashboard",
                        element: <AdminDashboard />
                    },
                    {
                        path: "add-book",
                        element: <AddBook />
                    },
                    {
                        path: "update-book/:id",
                        element: <UpdateBook />
                    }
                ]
            }
        ]
    }
]);

export default router;