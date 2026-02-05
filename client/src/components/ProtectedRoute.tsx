import { Navigate } from "react-router-dom";
import { authClient } from "../lib/authClient";
import type { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return null;

  if (!session) return <Navigate to="/login" />;

  if (!session.user.emailVerified) {
    return <Navigate to="/verify" />;
  }

  return children;
}
