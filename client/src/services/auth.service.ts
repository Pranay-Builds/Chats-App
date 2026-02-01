import { apiFetch } from "../lib/apiClient";

const API_URL = "http://localhost:5000/api";

export const authService = {
    
    getSession() {
        return apiFetch("/auth/session");
    },

    signOut() {
        return apiFetch("/auth/sign-out", {
            method: "POST",
        });
    },

    
    signUpWithEmail(email: string, password: string, name?: string) {
        return apiFetch("/auth/sign-up/email", {
            method: "POST",
            body: JSON.stringify({ email, password, name }),
        });
    },

    signInWithEmail(email: string, password: string) {
        return apiFetch("/auth/sign-in/email", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
    },

    
    signInWithGoogle() {
        window.location.href = `${API_URL}/auth/sign-in/google`;
    },
};
