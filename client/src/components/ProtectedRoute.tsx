import { Navigate, Outlet } from "react-router-dom";
import { authClient } from "../lib/authClient";
import { ClipLoader } from "react-spinners";

export function ProtectedRoute() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
        <ClipLoader size={40} color="white" />
      </div>
    )
  }

  if (!session) return <Navigate to="/login" />;

  if (!session.user.emailVerified) {
    return <Navigate to="/verify" />;
  }

  return <Outlet />;
}
