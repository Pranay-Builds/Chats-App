import { create } from "zustand";


type User = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  bio?: string | null;
};


type UserStore = {
    user: User | null,
    loading: boolean;
    setUser: (user: User | null) => void;
}


export const useUser = create<UserStore>((set) => ({
    user: null,
    loading: true,
    setUser: (user) => set({ user, loading: false })
}));