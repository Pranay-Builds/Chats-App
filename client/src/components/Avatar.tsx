type AvatarProps = {
  name?: string;
  image?: string | null;
  className?: string;
};

function getInitials(name?: string) {
  if (!name) return "?";

  const parts = name.trim().split(" ");

  if (parts.length === 1) {
    return parts[0][0].toUpperCase();
  }

  return (
    parts[0][0] + parts[parts.length - 1][0]
  ).toUpperCase();
}

export default function Avatar({
  name,
  image,
  className = "w-10 h-10",
}: AvatarProps) {
  const initials = getInitials(name);

  return image ? (
    <img
      src={image}
      className={`rounded-full object-cover ${className}`}
    />
  ) : (
    <div
      className={`rounded-full flex items-center justify-center font-semibold bg-zinc-700 text-white ${className}`}
    >
      {initials}
    </div>
  );
}
