import { Navigate, Outlet } from "react-router-dom";
import { authClient } from "../lib/authClient";
import { ClipLoader } from "react-spinners";

export function GuestRoute() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
                <ClipLoader size={40} color="white" />
            </div>
        )
    }

    if (session) return <Navigate to="/chats" />;


    return <Outlet />;
}
