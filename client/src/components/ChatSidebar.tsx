import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import { apiFetch } from "../lib/apiClient";

type Chat = {
  id: string;
  name: string;
  lastMessage?: string | null;
  image?: string | null;
};

export default function ChatsSidebar() {
  const [search, setSearch] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadChats() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiFetch("/chats", { method: "GET" });

        if (!res.ok) {
          setError("Failed to load chats");
          setChats([]);
          return;
        }

        const apiChats = res.data.chats as Array<{
          id: string;
          name?: string | null;
          displayName?: string | null;
          lastMessage?: string | null;
          image?: string | null;
        }>;

        const mapped: Chat[] = apiChats.map((chat) => ({
          id: chat.id,
          name: chat.name || chat.displayName || "Unknown",
          lastMessage: chat.lastMessage ?? null,
          image: chat.image ?? null,
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
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-95 h-screen border-r border-border bg-background flex flex-col">

      {/* HEADER */}
      <div className="px-4 py-4 border-b border-border sticky top-0 bg-background z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Chats</h1>
          <span className="text-xs opacity-60">
            {loading ? "…" : filteredChats.length}
          </span>
        </div>

        {/* SEARCH */}
        <div className="mt-3 flex items-center gap-2 bg-foreground/5 focus-within:bg-foreground/10 rounded-lg px-3 py-2 transition">
          <Search size={16} className="opacity-60" />
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>
      </div>

      {/* CHAT LIST */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="px-4 py-3 text-sm opacity-60">
            Loading chats...
          </div>
        )}

        {!loading && error && (
          <div className="px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {!loading && !error && filteredChats.length === 0 && (
          <div className="px-4 py-3 text-sm opacity-60">
            No chats yet.
          </div>
        )}

        {!loading && !error && filteredChats.map((chat) => (
          <NavLink
            key={chat.id}
            to={`/chats/${chat.id}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 transition
               hover:bg-foreground/5
               ${isActive ? "bg-foreground/10" : ""}`
            }
          >
            {/* Avatar + Online dot */}
            <div className="relative">
              <Avatar name={chat.name} image={chat.image} />
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="truncate font-medium">
                  {chat.name}
                </p>
              </div>

              {chat.lastMessage && (
                <p className="text-sm truncate opacity-60">
                  {chat.lastMessage}
                </p>
              )}
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
