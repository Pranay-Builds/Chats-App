import { useEffect } from "react";
import { useUser } from "../store/useUser";
import { MessageCircle, UserMinus } from "lucide-react";
import { apiFetch } from "../lib/apiClient";
import { toast } from "sonner";
import { redirect, useNavigate } from "react-router-dom";

interface Friend {
  id: string;
  name: string;
  image?: string | null;
  bio?: string | null;
  friendCode?: string;
  createdAt: string;
}

function Friends() {
  const { user, fetchFriends, loadingFriends } = useUser();
  const navigate = useNavigate();


  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  const friendsSince = (friend: Friend) => {
    return friend?.createdAt
      ? new Date(friend.createdAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
        })
      : "";
  };


  const removeFriend = async (friendId: string) => {
    try {
        if (!confirm("Are you sure you want to remove this friend?")) {
            return;
        }

        const res = await apiFetch(`/friends/${friendId}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            throw new Error("Failed to remove friend");
        };
        
        toast.success("Friend removed");
        await fetchFriends();
    } catch (error) {
        toast.error("Failed to remove friend");
    }
  };


  const openOrCreateChatWithFriend = async (friendId: string) => {
    try {
      const res = await apiFetch(`/chats/chat/dm/${friendId}`, {
        method: "POST",
      });
    
      await fetchFriends();

        if (!res.ok) {
            throw new Error("Failed to open chat");
        };

        const { chatId } = res.data;
        navigate(`/chats/${chatId}`);
    }
        catch (error) {
            toast.error("Failed to open chat with friend");
        }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex p-2">
      <div className="w-110 border-r border-border p-6 flex flex-col">
        <h1 className="text-2xl font-semibold mb-6">Friends</h1>
        {loadingFriends && (
          <div className="flex justify-center py-6">
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
        )}

        {user?.friends?.length === 0 && !loadingFriends && (
            <p className="text-center text-muted-foreground">
                You have no friends yet. 
                <br />
                Add from <a href="/add" className="text-blue-500 hover:underline">here</a>.
            </p>
        )}
        <div className="space-y-2">
          {user?.friends?.map((friend) => (
            <div key={friend.id} className="flex justify-between items-center">
              <div className="flex items-center gap-3 p-0 bg-card">
                <img
                  src={friend.image || "/default-avatar.png"}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <h2 className="font-medium">{friend.name}</h2>

                  <p className="text-sm text-gray-400">
                    Friends since {friendsSince(friend)}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {friend.bio || "No bio"}
                  </p>
                </div>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  className="
      p-2 rounded-full
      text-muted-foreground
      hover:text-foreground
      hover:bg-foreground/5
      transition-colors
    "
                    onClick={() => openOrCreateChatWithFriend(friend.id)}
                >
                  <MessageCircle size={18} />
                </button>

                <button
                  className="
      p-2 rounded-full
      text-red-400
      hover:text-red-300
      hover:bg-red-500/10
      transition-colors
    "
                    onClick={() => removeFriend(friend.id)}
                >
                  <UserMinus size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Friends;
