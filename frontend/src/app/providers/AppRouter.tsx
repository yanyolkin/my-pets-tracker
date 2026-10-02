import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute, AnonymousRoute } from "@/entities/session";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { ProfilePage } from "@/pages/profile";
import { MapPage } from "@/pages/map";
import { AdminPage } from "@/pages/admin";
import { NotFoundPage } from "@/pages/not-found";
import { UserPage } from "@/pages/user";
import { MapRouteGuard } from "@/features/map-route-guard";

export const AppRouter = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: (
                <ProtectedRoute>
                    <ProfilePage />
                </ProtectedRoute>
            ),
        },
        {
            path: "/map",
            element: (
                <ProtectedRoute>
                    <MapRouteGuard>
                        <MapPage />
                    </MapRouteGuard>
                </ProtectedRoute>
            ),
        },
        {
            path: "/admin",
            element: (
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <AdminPage />
                </ProtectedRoute>
            ),
        },
        {
            path: "/login",
            element: (
                <AnonymousRoute>
                    <LoginPage />
                </AnonymousRoute>
            ),
        },
        {
            path: "/register",
            element: (
                <AnonymousRoute>
                    <RegisterPage />
                </AnonymousRoute>
            ),
        },
        {
            path: "user/:userId",
            element: (
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                    <UserPage />
                </ProtectedRoute>
            ),
        },
        {
            path: "*",
            element: <NotFoundPage />,
        },
        {
            path: "/403",
            element: (
                <p
                    style={{
                        textAlign: "center",
                        fontSize: "2rem",
                        fontWeight: "bold",
                    }}
                >
                    Forbidden
                </p>
            ),
        },
    ]);

    return <RouterProvider router={router} />;
};
