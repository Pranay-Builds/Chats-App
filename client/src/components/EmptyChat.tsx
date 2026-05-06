import { MessageCircle } from "lucide-react";

export default function EmptyChat() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
      <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
      <p>Select a chat to start messaging</p>
    </div>
  );
}