import { Outlet } from "react-router-dom";
import ChatsSidebar from "../components/ChatSidebar";

function Chats() {
  return (
    <div className="h-screen w-full bg-background text-foreground flex overflow-hidden">
      {/* LEFT */}
      <ChatsSidebar />

      {/* RIGHT */}
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}

export default Chats;
