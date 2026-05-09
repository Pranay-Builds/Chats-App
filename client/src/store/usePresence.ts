import { create } from "zustand";

type PresenceStore = {
  onlineUsers: string[];

  setOnlineUsers: (users: string[]) => void;
};

export const usePresence = create<PresenceStore>((set) => ({
  onlineUsers: [],

  setOnlineUsers: (users) =>
    set({
      onlineUsers: users,
    }),
}));
