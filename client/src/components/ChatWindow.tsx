import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../lib/apiClient";
import { useUser } from "../store/useUser";
import { Plus, SendHorizonal, Smile } from "lucide-react";
import { socket } from "../lib/socket";
import EmojiPicker, { Theme } from "emoji-picker-react";

type Message = {
  id: string;
  content: string;
  createdAt: string;

  sender: {
    id: string;
    name: string;
    image?: string | null;
  };

  reads?: {
    userId: string;
    readAt: string;
  }[];
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

// =========================
// IMAGE URL DETECTOR
// =========================
const isImageUrl = (url: string) => {
  return /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i.test(url);
};

const formatDayLabel = (date: string) => {
  const messageDate = new Date(date);

  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  const isToday = messageDate.toDateString() === today.toDateString();

  const isYesterday = messageDate.toDateString() === yesterday.toDateString();

  if (isToday) return "Today";

  if (isYesterday) return "Yesterday";

  return messageDate.toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const ChatWindow = () => {
  const { chatId } = useParams();
  const { user } = useUser();

  const [chat, setChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const [typingUsers, setTypingUsers] = useState<
    { userId: string; name: string }[]
  >([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // =========================
  // JOIN CHAT ROOM
  // =========================
  useEffect(() => {
    if (!chatId) return;

    socket.emit("join-chat", chatId);
  }, [chatId]);

  // =========================
  // LOAD CHAT
  // =========================
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

  // =========================
  // NEW MESSAGE SOCKET
  // =========================
  useEffect(() => {
    socket.on("new-message", (message: Message) => {
      setChat((prev) => {
        if (!prev) return prev;

        const alreadyExists = prev.messages.some(
          (msg) => msg.id === message.id,
        );

        if (alreadyExists) {
          return prev;
        }

        return {
          ...prev,
          messages: [...prev.messages, message],
        };
      });
    });

    return () => {
      socket.off("new-message");
    };
  }, []);

  // =========================
  // MARK AS READ
  // =========================
  useEffect(() => {
    const unreadMessages = chat?.messages.some(
      (msg) =>
        msg.sender.id !== user?.id &&
        !msg.reads?.some((r) => r.userId === user?.id),
    );

    if (!chatId || !unreadMessages) return;

    apiFetch(`/chats/messages/read/${chatId}`, {
      method: "POST",
    });
  }, [chat?.messages, chatId, user?.id]);

  // =========================
  // SEEN SOCKET
  // =========================
  useEffect(() => {
    socket.on("messages-seen", ({ userId, messageIds }) => {
      setChat((prev) => {
        if (!prev) return prev;

        return {
          ...prev,

          messages: prev.messages.map((msg) => {
            if (!messageIds.includes(msg.id)) {
              return msg;
            }

            const reads = msg.reads || [];

            const alreadyRead = reads.some((r) => r.userId === userId);

            if (alreadyRead) {
              return msg;
            }

            return {
              ...msg,

              reads: [
                ...reads,
                {
                  userId,
                  readAt: new Date().toISOString(),
                },
              ],
            };
          }),
        };
      });
    });

    return () => {
      socket.off("messages-seen");
    };
  }, []);

  // typing socket
  useEffect(() => {
    socket.on("user-typing", ({ userId, name }) => {
      if (userId === user?.id) return;

      setTypingUsers((prev) => {
        const exists = prev.some((u) => u.userId === userId);

        if (exists) return prev;

        return [...prev, { userId, name }];
      });
    });

    socket.on("user-stop-typing", ({ userId }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== userId));
    });

    return () => {
      socket.off("user-typing");
      socket.off("user-stop-typing");
    };
  }, [user?.id]);

  // theme
  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");

      setIsDarkMode(isDark);
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // =========================
  // AUTO SCROLL
  // =========================

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      120;

    if (isNearBottom) {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [chat?.messages, typingUsers]);

  const otherUser = chat?.members.find(
    (member) => member.user.id !== user?.id,
  )?.user;

  // =========================
  // SEND MESSAGE
  // =========================
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

      setMessage("");
      setShowEmojiPicker(false);
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div
          className="
            w-8 h-8
            rounded-full
            border-4
            border-zinc-700
            border-t-white
            animate-spin
          "
        />
      </div>
    );
  }

  // =========================
  // CHAT NOT FOUND
  // =========================
  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background text-white">
        Chat not found
      </div>
    );
  }

  // =========================
  // LAST SEEN MESSAGE
  // =========================
  const seenMessages = chat.messages.filter((m) => {
    const isMine = m.sender.id === user?.id;

    const hasBeenSeen = (m.reads || []).some((r) => r.userId !== user?.id);

    return isMine && hasBeenSeen;
  });

  const lastSeenMessageId = seenMessages[seenMessages.length - 1]?.id;

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      {/* HEADER */}
      <div
        className="
          h-16
          border-b
          border-black/5
          dark:border-white/5
          px-4
          flex
          items-center
          gap-3
          backdrop-blur-xl
          bg-background/80
          sticky
          top-0
          z-10
        "
      >
        {chat.isGroup ? (
          <div
            className="
      h-10 w-10
      rounded-2xl
    
      text-white
      flex items-center justify-center
      text-sm font-semibold
    "
          >
            {chat.name?.slice(0, 2).toUpperCase()}
          </div>
        ) : (
          <img
            src={otherUser?.image || "/default-avatar.png"}
            alt={otherUser?.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}

        <div className="leading-tight">
          <h2 className="font-medium text-sm text-zinc-900 dark:text-white">
            {chat.isGroup ? chat.name : otherUser?.name}
          </h2>

          <p className="text-xs text-muted-foreground text-black dark:text-white">
            {chat.isGroup ? `${chat.members.length} members` : "Active now"}
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div
        ref={messagesContainerRef}
        className="
          flex-1
          overflow-y-auto
          px-3
          py-4
          space-y-1
          bg-gradient-to-b
          from-background
          to-background/95
        "
      >
        {chat.messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <img
                src={otherUser?.image || "/default-avatar.png"}
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />

              <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                {otherUser?.name}
              </h2>

              <p className="text-muted-foreground mt-1">
                Start your conversation
              </p>
            </div>
          </div>
        )}

        {chat.messages.map((msg, index) => {
          const previousMessage = chat.messages[index - 1];

          const nextMessage = chat.messages[index + 1];

          const isSameSenderAsPrevious =
            previousMessage?.sender.id === msg.sender.id;

          const isSameSenderAsNext = nextMessage?.sender.id === msg.sender.id;

          const showDayDivider =
            !previousMessage ||
            new Date(previousMessage.createdAt).toDateString() !==
              new Date(msg.createdAt).toDateString();

          const isMine = msg.sender.id === user?.id;

          const reads = msg.reads || [];

          const isSeen = reads.some((r) => r.userId !== user?.id);

          const isImage = isImageUrl(msg.content);

          return (
            <>
              {showDayDivider && (
                <div className="flex justify-center my-4">
                  {" "}
                  <div className=" px-3 py-1 rounded-full text-xs bg-zinc-200 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 shadow-sm ">
                    {" "}
                    {formatDayLabel(msg.createdAt)}{" "}
                  </div>{" "}
                </div>
              )}

              <div
                key={msg.id}
                className={`
    flex
    items-end
    gap-2
    ${isMine ? "justify-end" : "justify-start"}
    ${isSameSenderAsPrevious ? "mt-1" : "mt-4"}
    animate-in
    fade-in
    slide-in-from-bottom-2
    duration-300
  `}
              >
                <div
                  className={`
                  flex flex-col
                  ${isMine ? "items-end" : "items-start"}
                  max-w-[78%]
                  md:max-w-[60%]
                `}
                >
                  {chat.isGroup && !isMine && !isSameSenderAsPrevious && (
                    <div
                      className="
        text-xs
        font-medium
        mb-1
        ml-3
        text-zinc-500
        flex items-center gap-2
      "
                    >
                      <img src={msg.sender?.image || ""} alt={msg.sender.name} className="w-8 h-8 rounded-full"></img>
                      {msg.sender.name}
                    </div>
                  )}
                  <div
                    className={`
                    relative
                    ${isImage ? "p-1" : "px-4 py-2.5"}
                    rounded-[26px]
                    text-[15px]
                    leading-relaxed
                    shadow-sm
                    whitespace-pre-wrap
                    break-words
                    overflow-hidden
                    ${
                      isMine
                        ? "bg-blue-500 text-white rounded-br-lg"
                        : "dark:bg-zinc-900 dark:text-zinc-100 bg-zinc-200 text-zinc-900 rounded-bl-lg"
                    }
                  `}
                  >
                    {isImage ? (
                      <img
                        src={msg.content}
                        alt="shared"
                        className="
                        rounded-[22px]
                        max-h-[420px]
                        w-full
                        object-cover
                        cursor-pointer
                        hover:opacity-95
                        transition-all
                      "
                      />
                    ) : (
                      <p>{msg.content}</p>
                    )}

                    <div
                      className={`
                      text-[11px]
                      mt-1
                      px-2
                      flex justify-end
                      ${isMine ? "text-blue-100/80" : "text-zinc-400"}
                    `}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {isMine && msg.id === lastSeenMessageId && isSeen && (
                    <span
                      className="
    text-[11px]
    mt-1
    px-1
    text-zinc-500
    flex items-center gap-1
  "
                    >
                      Seen at{" "}
                      {new Date(
                        reads.find((r) => r.userId !== user?.id)?.readAt || "",
                      ).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </>
          );
        })}

        {typingUsers.length > 0 && (
          <div className="flex items-end gap-2 px-2 py-2 animate-in fade-in duration-200">
            {/* Avatar */}
            <img
              src={otherUser?.image || "/default-avatar.png"}
              alt={typingUsers[0].name}
              className="
        w-8 h-8
        rounded-full
        object-cover
        shadow-sm
      "
            />

            {/* Bubble */}
            <div
              className="
        px-4 py-2.5
        rounded-2xl
        rounded-bl-md
        bg-zinc-200
        dark:bg-zinc-900
        shadow-sm
        flex items-center gap-1.5
      "
            >
              {/* Typing dots */}
              <div className="flex gap-1 items-center">
                <span
                  className="
            w-2 h-2
            rounded-full
            bg-zinc-500
            animate-bounce
          "
                />

                <span
                  className="
            w-2 h-2
            rounded-full
            bg-zinc-500
            animate-bounce
            [animation-delay:0.15s]
          "
                />

                <span
                  className="
            w-2 h-2
            rounded-full
            bg-zinc-500
            animate-bounce
            [animation-delay:0.3s]
          "
                />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <form
        onSubmit={sendMessage}
        className="
          relative
          p-3
          border-t
          border-black/5
          dark:border-white/5
          bg-background/80
          backdrop-blur-xl
        "
      >
        {/* EMOJI PICKER */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4 z-50">
            <EmojiPicker
              theme={isDarkMode ? Theme.DARK : Theme.LIGHT}
              lazyLoadEmojis
              searchDisabled={false}
              skinTonesDisabled={false}
              previewConfig={{
                showPreview: false,
              }}
              onEmojiClick={(emojiObject: any) => {
                setMessage((prev) => prev + emojiObject.emoji);
              }}
            />
          </div>
        )}
        <div
          className="
            flex items-center gap-2
            dark:bg-zinc-900
            bg-zinc-100
            rounded-full
            px-2 py-2
            border
            border-black/5
            dark:border-white/5
            shadow-sm
          "
        >
          {/* PLUS */}
          <button
            type="button"
            className="
              h-9 w-9
              rounded-full
              flex items-center justify-center
              text-zinc-500
              hover:bg-black/5
              dark:hover:bg-white/5
              transition-all
              shrink-0
            "
          >
            <Plus size={18} />
          </button>

          {/* INPUT */}
          <input
            type="text"
            placeholder="Message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);

              socket.emit("typing", {
                chatId,
                userId: user?.id,
                name: user?.name,
              });

              clearTimeout((window as any).typingTimeout);

              (window as any).typingTimeout = setTimeout(() => {
                socket.emit("stop-typing", {
                  chatId,
                  userId: user?.id,
                });
              }, 1200);
            }}
            className="
              flex-1
              bg-transparent
              px-1
              text-sm
              outline-none
              text-zinc-900
              dark:text-white
              placeholder:text-zinc-500
            "
          />

          {/* EMOJI */}
          <button
            type="button"
            className="
              h-9 w-9
              rounded-full
              flex items-center justify-center
              text-zinc-500
              hover:bg-black/5
              dark:hover:bg-white/5
              transition-all
              shrink-0
            "
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <Smile size={19} />
          </button>

          {/* SEND */}
          <button
            type="submit"
            className="
              h-9 w-9
              rounded-full
              bg-blue-500
              hover:bg-blue-600
              text-white
              flex items-center justify-center
              transition-all
              shrink-0
            "
          >
            <SendHorizonal size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
