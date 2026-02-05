import { createContext, useContext } from "react";
import { authClient } from "../lib/authClient";
import type { ReactNode } from "react";

type AuthContextType = {
  user: any | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        loading: isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
