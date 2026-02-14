import { useState } from "react";
import Avatar from "./Avatar";
import { Search } from "lucide-react";
import { NavLink } from "react-router-dom";

type Chat = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  online?: boolean;
  image?: string | null;
};

const dummyChats: Chat[] = [
  {
    id: "1",
    name: "Chakory",
    lastMessage: "Heyllo!",
    time: "12:45",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Pranay",
    lastMessage: "Send the repo link",
    time: "11:10",
  },
  {
    id: "3",
    name: "Manvi",
    lastMessage: "Okay 👍",
    time: "Yesterday",
    online: true,
  },
  {
    id: "4",
    name: "Design Team",
    lastMessage: "New icons look clean",
    time: "Mon",
    unread: 5,
  },
];

export default function ChatsSidebar() {
  const [search, setSearch] = useState("");

  const filteredChats = dummyChats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-95 h-screen border-r border-border bg-background flex flex-col">

      {/* HEADER */}
      <div className="px-4 py-4 border-b border-border sticky top-0 bg-background z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Chats</h1>
          <span className="text-xs opacity-60">
            {filteredChats.length}
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
        {filteredChats.map((chat) => (
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

              {chat.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p
                  className={`truncate ${
                    chat.unread ? "font-semibold" : "font-medium"
                  }`}
                >
                  {chat.name}
                </p>

                <span className="text-xs opacity-60">
                  {chat.time}
                </span>
              </div>

              <p
                className={`text-sm truncate ${
                  chat.unread ? "opacity-90" : "opacity-60"
                }`}
              >
                {chat.lastMessage}
              </p>
            </div>

            {/* Unread badge */}
            {chat.unread && (
              <div className="min-w-[20px] h-[20px] text-[11px] rounded-full bg-primary text-primary-foreground flex items-center justify-center px-1.5">
                {chat.unread}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
