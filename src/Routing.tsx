import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyProfilePage from "./pages/MyProfilePage";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateReviewPage from "./pages/CreateReviewPage";
import BookDetailsPage from "./pages/BookDetailsPage";

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
                path: "/bok/:id",
                element: <BookDetailsPage />
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
                element: (
                    <ProtectedRoute> {/* skyddad route för att visa användarens profil */ }
                        <MyProfilePage />
                    </ProtectedRoute>
                )
                
            },
            {
                path: "/skapa-recension",
                element: (
                    <ProtectedRoute> {/* skyddad route för att skapa en recension */ }
                        <CreateReviewPage />
                    </ProtectedRoute>
                )
            }
        ]
    }
])

export default router;