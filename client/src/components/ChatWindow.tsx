import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../lib/apiClient";
import { useUser } from "../store/useUser";
import { SendHorizonal } from "lucide-react";

type Message = {
  id: string;
  content: string;
  createdAt: string;

  sender: {
    id: string;
    name: string;
    image?: string | null;
  };
};

type Member = {
  user: {
    id: string;
    name: string;
    image?: string | null;
    bio?: string | null;
  };
};

type Chat = {
  id: string;
  name?: string | null;
  isGroup: boolean;

  members: Member[];
  messages: Message[];
};

const ChatWindow = () => {
  const { chatId } = useParams();
  const { user } = useUser();

  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadChat() {
      try {
        setLoading(true);

        const res = await apiFetch(`/chats/${chatId}`, {
          method: "GET",
        });

        if (!res.ok) return;

        setChat(res.data.chat);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadChat();
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat?.messages]);

  const otherUser = chat?.members.find(
    (member) => member.user.id !== user?.id,
  )?.user;

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    try {
      const res = await apiFetch("/messages", {
        method: "POST",

        body: JSON.stringify({
          chatId,
          content: message,
        }),
      });

      if (!res.ok) return;

      setChat((prev) => {
        if (!prev) return prev;

        return {
          ...prev,

          messages: [
            ...prev.messages,
            {
              ...res.data.message,

              sender: {
                id: user!.id,
                name: user!.name,
                image: user!.image,
              },
            },
          ],
        };
      });

      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-6">
        <div
          className="
        w-8 h-8
        rounded-full
        border-4
        border-zinc-300
        dark:border-zinc-700
        border-t-black
        dark:border-t-white
        animate-spin
      "
        />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Chat not found
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* HEADER */}
      <div className="h-16 border-b border-border px-6 flex items-center gap-3">
        <img
          src={otherUser?.image || "/default-avatar.png"}
          alt={otherUser?.name}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div>
          <h2 className="font-semibold">
            {chat.isGroup ? chat.name : otherUser?.name}
          </h2>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {chat.messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <img
                src={otherUser?.image || "/default-avatar.png"}
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />

              <h2 className="text-xl font-semibold">{otherUser?.name}</h2>

              <p className="text-muted-foreground mt-1">
                Start your conversation
              </p>
            </div>
          </div>
        )}

        {chat.messages.map((msg) => {
          const isMine = msg.sender.id === user?.id;

          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
    max-w-[70%]
    rounded-2xl
    px-4 py-3
    text-sm
    ${
      isMine
        ? "bg-blue-500 text-white rounded-br-md"
        : "bg-foreground/5 rounded-bl-md"
    }
  `}
              >
                <p className="leading-relaxed break-words">{msg.content}</p>

                <div
                  className={`
      text-[9px]
      mt-1
      flex justify-end
      ${isMine ? "text-blue-100" : "text-muted-foreground"}
    `}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <form onSubmit={sendMessage} className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="
              flex-1
              bg-foreground/5
              border border-border
              rounded-2xl
              px-4 py-3
              outline-none
            "
          />

          <button
            type="submit"
            className="
              h-12 w-12
              rounded-full
              bg-blue-500
              hover:bg-blue-600
              text-white
              flex items-center justify-center
              transition-colors
            "
          >
            <SendHorizonal size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
