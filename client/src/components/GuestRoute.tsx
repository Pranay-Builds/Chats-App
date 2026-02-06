import { Navigate } from "react-router-dom";
import { authClient } from "../lib/authClient";
import type { ReactNode } from "react";
import { ClipLoader } from "react-spinners";

export function GuestRoute({ children }: { children: ReactNode }) {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
                <ClipLoader size={40} color="white" />
            </div>
        )
    }

    if (session) return <Navigate to="/home" />;


    return children;
}
