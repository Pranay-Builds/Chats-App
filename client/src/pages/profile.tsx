import { useEffect, useRef, useState } from "react";
import Avatar from "../components/Avatar";
import { useUser } from "../store/useUser";
import { Check, Pencil } from "lucide-react";
import { apiFetch } from "../lib/apiClient";
import { toast } from "sonner";

function Profile() {
  const { user, setUser } = useUser();

  const joinedAt =
  user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : "";


  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);

  /* ---------------- AVATAR ---------------- */

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  const handleSaveAvatar = async () => {
    if (!selectedFile || !user) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    const res = await apiFetch("/users/me/avatar", {
      method: "PATCH",
      body: formData,
    });

    if (!res.ok) {
      toast.error("Failed to upload avatar");
      setUploading(false);
      return;
    }

    setUser({
      ...user,
      image: res.data.avatarUrl.url,
    });

    setPreviewUrl(null);
    setSelectedFile(null);
    setUploading(false);

    toast.success("Avatar updated");
  };

  /* ---------------- PROFILE UPDATE ---------------- */

  const handleUpdateProfile = async () => {
    if (!user) return;

    if (!name && !bio) {
      toast.error("Fields cannot be empty");
      return;
    }

    const res = await apiFetch("/users/me", {
      method: "PATCH",
      body: JSON.stringify({ name, bio }),
    });

    if (!res.ok) {
      toast.error("Failed to update profile");
      return;
    }

    setUser({
      ...user,
      ...res.data.user,
    });

    toast.success("Profile updated!");
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    if (user?.name) setName(user.name);
    if (user?.bio) setBio(user.bio);
  }, [user]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex p-2">
      <div className="w-90 border-r border-border p-6">
        <h1 className="text-2xl font-semibold">Profile</h1>

        {/* Avatar */}
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />

          <button onClick={() => fileInputRef.current?.click()}>
            <Avatar
              name={user?.name}
              image={previewUrl || user?.image}
              className="w-30 h-30 text-3xl rounded-full border-2 border-border p-1"
            />
          </button>

          {previewUrl && (
            <button
              disabled={uploading}
              onClick={handleSaveAvatar}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium"
            >
              Save pfp
            </button>
          )}
        </div>

        {/* Name */}
        <div className="mt-8">
          <p className="font-semibold text-foreground/60 mb-1">Name</p>

          {!isEditingName ? (
            <div className="flex justify-between">
              <p className="text-lg">{user?.name}</p>
              <button onClick={() => setIsEditingName(true)}>
                <Pencil size={20} />
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                className="w-full bg-transparent px-3 py-2 border-b-4 border-b-blue-600 outline-none"
              />

              <button
                onClick={() => {
                  handleUpdateProfile();
                  setIsEditingName(false);
                }}
              >
                <Check size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="mt-8">
          <p className="font-semibold text-foreground/60 mb-1">Bio</p>

          {!isEditingBio ? (
            <div className="flex justify-between">
              <p className="text-lg">
                {user?.bio || "Add a bio..."}
              </p>
              <button onClick={() => setIsEditingBio(true)}>
                <Pencil size={20} />
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <input
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                autoFocus
                className="w-full bg-transparent px-3 py-2 border-b-4 border-b-blue-600 outline-none"
              />

              <button
                onClick={() => {
                  handleUpdateProfile();
                  setIsEditingBio(false);
                }}
              >
                <Check size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Email */}
        <div className="mt-8">
          <p className="font-semibold text-foreground/60 mb-1">Email</p>

          <p className="text-foreground/90">{user?.email}</p>
        </div>


        {/* Joined At */}
        <div className="mt-8">
          <p className="font-semibold text-foreground/60 mb-1">Joined At</p>

          <p>Member since {joinedAt}</p>
        </div>
      </div>

      {/* Right Preview */}
      <div className="flex-1 flex justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <Avatar name={user?.name} image={user?.image} />
          <h1 className="text-3xl font-semibold">{user?.name}</h1>
        </div>
      </div>
    </div>
  );
}

export default Profile;
