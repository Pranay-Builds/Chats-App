import { create } from "zustand";
import { apiFetch } from "../lib/apiClient";


type User = {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    bio?: string | null;
    friendCode?: string;
    createdAt: string;
};


type UserStore = {
    user: User | null,
    loading: boolean;
    setUser: (user: User | null) => void;
    fetchProfile: () => Promise<void>;
}


export const useUser = create<UserStore>((set) => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user, loading: false }),
    fetchProfile: async () => {
        try {
            set({ loading: true })
            const res = await apiFetch(
                "/users/me",
                { method: "GET" }
            );

            set({ user: res.data.user });
            set({ loading: false });
        } catch (err) {
            console.error(err);
            set({ loading: false })
        }
    }
}));