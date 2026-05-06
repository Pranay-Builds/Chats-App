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
  friends?: User[];
};

type UserStore = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  fetchProfile: () => Promise<void>;
  fetchFriends: () => Promise<void>;
  loadingFriends: boolean;
};

export const useUser = create<UserStore>((set) => ({
  user: null,
  loading: true,
  loadingFriends: false,
  setUser: (user) => set({ user, loading: false }),
  fetchProfile: async () => {
    try {
      set({ loading: true });

      const res = await apiFetch("/users/me", { method: "GET" });

      set((state) => ({
        user: {
          ...res.data.user,
          friends: state.user?.friends || [],
        },
        loading: false,
      }));
    } catch (err) {
      console.error(err);
      set({ loading: false });
    }
  },
  fetchFriends: async () => {
    try {
      set({ loadingFriends: true });
      const res = await apiFetch("/friends", { method: "GET" });

      set((state) => ({
        user: state.user
          ? {
              ...state.user,
              friends: res.data.friends,
            }
          : null,
      }));
    } catch (err) {
      console.error(err);
    } finally {
        set({ loadingFriends: false });
    }
  },
}));
