import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyProfilePage from "./pages/MyProfilePage";
import Layout from "./components/Layout";

const router = createBrowserRouter( [
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: "/logga-in",
                element: <LoginPage />
            },
            {
                path: "/registrera",
                element: <RegisterPage />
            },
            {
                path: "/min-profil",
                element: <MyProfilePage />
            }
        ]
    }
])

export default router;