import { Search } from "lucide-react";
import React from "react";
import { useUser } from "../store/useUser";
import { apiFetch } from "../lib/apiClient";
import { toast } from "sonner";
import Avatar from "../components/Avatar";

interface User {
  id: string;
  name: string;
  image: string;
  friendCode: string;
}

interface FriendRequest {
  id: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    image?: string | null;
    bio?: string | null;
    friendCode: string;
  };
}

const Add = () => {
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState<User[]>([]);
  const [requests, setRequests] = React.useState<FriendRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = React.useState(true);
  const [sendingTo, setSendingTo] = React.useState<string | null>(null);
  const [actingOn, setActingOn] = React.useState<string | null>(null);
  const { user } = useUser();

  // Search users by name or friend code
  React.useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!search.trim()) {
        setResults([]);
        return;
      }

      try {
        const res = await apiFetch(`/friends/search?q=${search}`, {
          method: "GET",
        });

        if (!res.ok) {
          setResults([]);
          return;
        }

        setResults(res.data.users);
      } catch (err) {
        console.error(err);
        setResults([]);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timeout);
  }, [search]);

  // Load incoming friend requests
  React.useEffect(() => {
    (async () => {
      try {
        setLoadingRequests(true);
        const res = await apiFetch("/friends/requests", { method: "GET" });

        if (!res.ok) {
          setRequests([]);
          return;
        }

        setRequests(res.data.requests);
      } catch (err) {
        console.error(err);
        setRequests([]);
      } finally {
        setLoadingRequests(false);
      }
    })();
  }, []);

  const handleSendRequest = async (target: User) => {
    if (sendingTo) return;

    setSendingTo(target.id);
    try {
      const res = await apiFetch("/friends/request", {
        method: "POST",
        body: JSON.stringify({ friendCode: target.friendCode }),
      });

      if (!res.ok) {
        toast.error(res.data?.message || "Failed to send friend request");
        return;
      }

      toast.success("Friend request sent");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to send friend request");
    } finally {
      setSendingTo(null);
    }
  };

  const handleAccept = async (id: string) => {
    setActingOn(id);
    try {
      const res = await apiFetch(`/friends/request/${id}`, {
        method: "POST",
      });

      if (!res.ok) {
        toast.error(res.data?.message || "Failed to accept request");
        return;
      }

      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Friend request accepted");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to accept request");
    } finally {
      setActingOn(null);
    }
  };

  const handleReject = async (id: string) => {
    setActingOn(id);
    try {
      const res = await apiFetch(`/friends/request/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error(res.data?.message || "Failed to reject request");
        return;
      }

      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Friend request rejected");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to reject request");
    } finally {
      setActingOn(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex p-2">
      <div className="w-90 border-r border-border p-6 flex flex-col">
        <h1 className="text-2xl font-semibold">Add Friends</h1>

        <div className="mt-3 flex items-center gap-2 bg-foreground/5 focus-within:bg-foreground/10 rounded-lg px-3 py-2 transition">
          <Search size={16} className="opacity-60" />
          <input
            type="text"
            placeholder="Search by name or friend code"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {/* Search results */}
        <div className="mt-4 flex flex-col gap-3">
          {results.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-foreground/5 transition"
            >
              <img src={u.image} className="w-10 h-10 rounded-full" />

              <div className="flex-1">
                <p className="text-sm font-medium">{u.name}</p>
                <p className="text-xs opacity-70">{u.friendCode}</p>
              </div>

              <button
                onClick={() => handleSendRequest(u)}
                disabled={sendingTo === u.id}
                className="text-xs px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60"
              >
                {sendingTo === u.id ? "Sending..." : "Add friend"}
              </button>
            </div>
          ))}
        </div>

        {/* Incoming friend requests */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Friend Requests</h2>

          {loadingRequests ? (
            <p className="text-sm opacity-60">Loading requests...</p>
          ) : requests.length === 0 ? (
            <p className="text-sm opacity-60">No incoming requests.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between gap-3 p-2 rounded-lg bg-foreground/5"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={req.sender.name}
                      image={req.sender.image}
                      className="w-10 h-10"
                    />
                    <div>
                      <p className="text-sm font-medium">{req.sender.name}</p>
                      <p className="text-xs opacity-70">
                        {req.sender.friendCode}
                      </p>
                      {req.sender.bio && (
                        <p className="text-xs opacity-60 line-clamp-2">
                          {req.sender.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAccept(req.id)}
                      disabled={actingOn === req.id}
                      className="text-xs px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-60"
                    >
                      {actingOn === req.id ? "Working..." : "Accept"}
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      disabled={actingOn === req.id}
                      className="text-xs px-3 py-1 rounded-lg bg-foreground/10 hover:bg-foreground/20 disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center gap-4">
          <p>Your Friend Code: </p>
          <div
            className="px-3 py-1 bg-foreground/10 rounded-lg cursor-pointer"
            onClick={() =>
              navigator.clipboard.writeText(user?.friendCode || "")
            }
          >
            <p className="text-foreground/80">{user?.friendCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;