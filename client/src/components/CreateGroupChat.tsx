
import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { apiFetch } from "../lib/apiClient";
import Avatar from "./Avatar";

type Friend = {
  id: string;
  name: string;
  image?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateGroupModal({
  open,
  onClose,
}: Props) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function loadFriends() {
      try {
        const res = await apiFetch("/friends");

        if (!res.ok) return;

        setFriends(res.data.friends);
      } catch (err) {
        console.error(err);
      }
    }

    loadFriends();
  }, [open]);

  const toggleUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((u) => u !== id)
        : [...prev, id],
    );
  };

  const createGroupChat = async () => {
    if (!groupName.trim()) return;

    if (selectedUsers.length < 2) {
      alert("Select at least 2 users");
      return;
    }

    try {
      setLoading(true);

      const res = await apiFetch("/chats/group", {
        method: "POST",

        body: JSON.stringify({
          name: groupName,
          membersId: selectedUsers,
        }),
      });

      if (!res.ok) return;

      const groupId = res.data.newGroupChat.id;

      window.location.href = `/chats/${groupId}`;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        bg-black/50
        backdrop-blur-sm
        flex items-center justify-center
        p-4
      "
    >
      <div
        className="
          w-full max-w-md
          rounded-3xl
          bg-background
          border border-black/5
          dark:border-white/5
          shadow-2xl
          overflow-hidden
        "
      >
        {/* HEADER */}
        <div
          className="
            flex items-center justify-between
            px-5 py-4
            border-b border-black/5
            dark:border-white/5
          "
        >
          <div>
            <h2 className="text-lg font-semibold">
              Create Group
            </h2>

            <p className="text-sm text-muted-foreground">
              Start a new group conversation
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              h-10 w-10
              rounded-xl
              hover:bg-black/5
              dark:hover:bg-white/5
              flex items-center justify-center
              transition-all
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5">
          {/* GROUP NAME */}
          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="
              w-full
              rounded-2xl
              px-4 py-3
              bg-black/[0.03]
              dark:bg-white/[0.04]
              border border-black/5
              dark:border-white/5
              outline-none
              mb-4
            "
          />

          {/* FRIENDS */}
          <div className="space-y-2 max-h-[350px] overflow-y-auto">
            {friends.map((friend) => {
              const selected = selectedUsers.includes(
                friend.id,
              );

              return (
                <button
                  key={friend.id}
                  onClick={() => toggleUser(friend.id)}
                  className={`
                    w-full
                    flex items-center justify-between
                    px-3 py-3
                    rounded-2xl
                    transition-all
                    border
                    ${
                      selected
                        ? `
                          bg-blue-500/10
                          border-blue-500/20
                        `
                        : `
                          border-transparent
                          hover:bg-black/[0.03]
                          dark:hover:bg-white/[0.04]
                        `
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={friend.name}
                      image={friend.image}
                    />

                    <span className="font-medium text-sm">
                      {friend.name}
                    </span>
                  </div>

                  {selected && (
                    <div
                      className="
                        h-6 w-6
                        rounded-full
                        bg-blue-500
                        text-white
                        flex items-center justify-center
                      "
                    >
                      <Check size={14} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* CREATE BUTTON */}
          <button
            onClick={createGroupChat}
            disabled={loading}
            className="
              w-full
              mt-5
              h-12
              rounded-2xl
              bg-blue-500
              hover:bg-blue-600
              disabled:opacity-50
              text-white
              font-medium
              transition-all
            "
          >
            {loading ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}

