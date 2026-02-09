import { useEffect, useRef, useState } from "react";
import Avatar from "../components/Avatar";
import { useUser } from "../store/useUser";
import { Check, Pencil } from "lucide-react";
import { apiFetch } from "../lib/apiClient";
import { toast } from "sonner";



function Profile() {
  const { user, setUser } = useUser();

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [uploading, setUploading] = useState(false);


  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  }


  const handleSaveAvatar = async () => {

    if (!selectedFile) return;
    if (!user) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("avatar", selectedFile);

    const data = await apiFetch("/users/me/avatar", {
      method: "PATCH",
      body: formData
    });

    if (!data.ok) {
      toast.error("Failed to upload avatar");
      setUploading(false);
      return;
    };


    setUser({
      ...user,
      image: data.data.avatarUrl.url
    });


    setPreviewUrl(null);
    setSelectedFile(null);
    toast.success("Avatar updated");
    setUploading(false);
  }


  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }

    if (user?.bio) {
      setBio(user.bio);
    }
  }, [user]);


  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);


  return (
    <div className="min-h-screen w-full bg-background text-foreground flex p-2">
      <div className="w-90 border-r border-border p-6">
        <h1 className="text-foreground text-2xl font-semibold">Profile</h1>
        <div className="flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <button className="cursor-pointer hover:opacity-80 transition duration-200" onClick={() => fileInputRef.current?.click()}>
            <Avatar
              name={user?.name}
              image={previewUrl || user?.image}
              className="w-30 h-30 text-3xl rounded-full border-2 border-border p-1"
            />
          </button>
          {previewUrl && (
            <button className="
  mt-4 px-4 py-2
  bg-blue-600 hover:bg-blue-500
  active:scale-[0.98]
  rounded-lg
  font-medium
  transition
  shadow-sm
"
              disabled={uploading}
              onClick={handleSaveAvatar}
            >
              Save pfp
            </button>

          )}
        </div>
        <div className="mt-8">
          <p className="font-semibold text-foreground/60 mb-1">Name</p>
          {!isEditingName ? (
            <div className="flex items-center justify-between">
              <p className="text-lg">{user?.name}</p>

              <button onClick={() => setIsEditingName(true)} className="cursor-pointer hover:opacity-90">
                <Pencil size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                autoFocus
                className={`w-full bg-transparent px-3 py-2 outline-none ${isEditingName && "border-b-4 border-b-blue-600"}`}
              />
              <button onClick={() => setIsEditingName(true)} className="cursor-pointer hover:opacity-90">
                <Check size={20} />
              </button>
            </div>
          )}

          <div className="mt-8">
            <p className="font-semibold text-foreground/60 mb-1">Bio</p>
            {!isEditingBio ? (
              <div className="flex items-center justify-between">
                <p className="text-lg">{user?.bio}</p>

                <button onClick={() => setIsEditingBio(true)} className="cursor-pointer hover:opacity-90">
                  <Pencil size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  onBlur={() => setIsEditingBio(false)}
                  autoFocus
                  className={`w-full bg-transparent px-3 py-2 outline-none ${isEditingBio && "border-b-4 border-b-blue-600"}`}
                />
                <button onClick={() => setIsEditingBio(true)} className="cursor-pointer hover:opacity-90">
                  <Check size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <Avatar
            name={user?.name}
            image={user?.image}
          />
          <h1 className="font-semibold text-3xl text-foreground">{user?.name}</h1>
        </div>
      </div>
    </div>
  )
}

export default Profile;