import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { Search, Pencil } from "lucide-react";
import { NavLink } from "react-router-dom";
import { apiFetch } from "../lib/apiClient";
import { usePresence } from "../store/usePresence";
import CreateGroupModal from "./CreateGroupChat";

type Chat = {
  id: string;

  userId?: string;

  name: string;

  lastMessage?: string | null;

  image?: string | null;

  unreadCount?: number;

  isGroup?: boolean;
};

export default function ChatsSidebar() {
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const { onlineUsers } = usePresence();

  useEffect(() => {
    async function loadChats() {
      setLoading(true);
      setError(null);

      try {
        const res = await apiFetch("/chats", {
          method: "GET",
        });

        if (!res.ok) {
          setError("Failed to load chats");
          setChats([]);
          return;
        }

        const apiChats = res.data.chats as Array<{
          id: string;
          userId?: string;
          name?: string | null;
          displayName?: string | null;
          lastMessage?: string | null;
          image?: string | null;
          unreadCount?: number;
          isGroup?: boolean;
        }>;

        const mapped: Chat[] = apiChats.map((chat) => ({
          id: chat.id,

          userId: chat.userId,

          name: chat.name || chat.displayName || "Unknown",

          lastMessage: chat.lastMessage ?? null,

          image: chat.image ?? null,

          unreadCount: chat.unreadCount ?? 0,

          isGroup: chat.isGroup,
        }));

        setChats(mapped);
      } catch (err) {
        console.error(err);

        setError("Failed to load chats");

        setChats([]);
      } finally {
        setLoading(false);
      }
    }

    loadChats();
  }, []);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="
        w-[380px]
        h-screen
        border-r
        border-black/5
        dark:border-white/5
        bg-background/80
        backdrop-blur-2xl
        flex
        flex-col
      "
    >
      {/* HEADER */}
      <div
        className="
          sticky
          top-0
          z-20
          px-4
          py-4
          border-b
          border-black/5
          dark:border-white/5
          bg-background/70
          backdrop-blur-2xl
        "
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Messages</h1>

            <p className="text-xs text-muted-foreground mt-0.5">
              {loading ? "Loading..." : `${filteredChats.length} conversations`}
            </p>
          </div>

          <button
            className="
              h-10
              w-10
              rounded-2xl
              bg-blue-500
              hover:bg-blue-600
              text-white
              flex
              items-center
              justify-center
              transition-all
              shadow-lg
              shadow-blue-500/20
            "
            onClick={() => setShowCreateGroup(true)}
          >
            <Pencil size={18} />
          </button>
        </div>

        {/* SEARCH */}
        <div
          className="
            mt-4
            flex
            items-center
            gap-2
            rounded-2xl
            px-3
            py-3
            bg-black/[0.03]
            dark:bg-white/[0.04]
            border
            border-black/5
            dark:border-white/5
            focus-within:ring-2
            focus-within:ring-blue-500/20
            transition-all
          "
        >
          <Search size={17} className="text-zinc-500 shrink-0" />

          <input
            type="text"
            placeholder="Search conversations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              bg-transparent
              outline-none
              text-sm
              w-full
              placeholder:text-zinc-500
            "
          />
        </div>
      </div>

      {/* CHAT LIST */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {loading && (
          <div className="px-4 py-6">
            <div className="space-y-3">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="
                    h-16
                    rounded-2xl
                    bg-black/[0.04]
                    dark:bg-white/[0.04]
                    animate-pulse
                  "
                />
              ))}
            </div>
          </div>
        )}

        {!loading && error && (
          <div
            className="
              flex
              items-center
              justify-center
              h-full
              text-sm
              text-red-400
            "
          >
            {error}
          </div>
        )}

        {!loading && !error && filteredChats.length === 0 && (
          <div
            className="
              h-full
              flex
              flex-col
              items-center
              justify-center
              text-center
              px-6
            "
          >
            <div
              className="
                w-16
                h-16
                rounded-3xl
                bg-black/[0.04]
                dark:bg-white/[0.04]
                flex
                items-center
                justify-center
                mb-4
              "
            >
              <Search size={24} className="text-zinc-500" />
            </div>

            <h2 className="font-medium text-lg">No conversations</h2>

            <p className="text-sm text-muted-foreground mt-1">
              Try searching for someone else
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          filteredChats.map((chat) => {
            const isOnline = chat.userId && onlineUsers.includes(chat.userId);

            return (
              <NavLink
                key={chat.id}
                to={`/chats/${chat.id}`}
                className={({ isActive }) =>
                  `
                    group
                    relative
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    rounded-2xl
                    transition-all
                    duration-200
                    hover:bg-black/[0.04]
                    dark:hover:bg-white/[0.04]
                    ${
                      isActive
                        ? `
                          bg-blue-500/10
                          border
                          border-blue-500/10
                          shadow-sm
                        `
                        : ""
                    }
                  `
                }
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  {chat.isGroup ? (
                    <div
                      className="
      h-11 w-11
      rounded-2xl
      bg-gradient-to-br
      from-blue-500
      to-indigo-500
      text-white
      flex items-center justify-center
      text-sm font-semibold
      shadow-lg
    "
                    >
                      {chat.name?.slice(0, 2).toUpperCase()}
                    </div>
                  ) : (
                    <Avatar name={chat.name} image={chat.image} />
                  )}

                  {isOnline && (
                    <>
                      <div
                        className="
                          absolute
                          bottom-0
                          right-0
                          w-3.5
                          h-3.5
                          rounded-full
                          bg-green-500
                          border-2
                          border-background
                        "
                      />

                      <div
                        className="
                          absolute
                          bottom-0
                          right-0
                          w-3.5
                          h-3.5
                          rounded-full
                          bg-green-500
                          animate-ping
                          opacity-50
                        "
                      />
                    </>
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2
                      className="
                        truncate
                        font-medium
                        text-sm
                      "
                    >
                      {chat.name}
                    </h2>

                    <span
                      className="
                        text-[11px]
                        text-zinc-500
                        shrink-0
                      "
                    >
                      2m
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p
                      className="
                        text-sm
                        truncate
                        text-zinc-500
                      "
                    >
                      {chat.lastMessage || "Start chatting"}
                    </p>

                    {chat.unreadCount ? (
                      <div
                        className="
                          min-w-[20px]
                          h-5
                          px-1.5
                          rounded-full
                          bg-blue-500
                          text-white
                          text-[11px]
                          font-medium
                          flex
                          items-center
                          justify-center
                          shrink-0
                          shadow-sm
                        "
                      >
                        {chat.unreadCount}
                      </div>
                    ) : null}
                  </div>
                </div>
              </NavLink>
            );
          })}
      </div>

      <CreateGroupModal
        open={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
      />
    </div>
  );
}
