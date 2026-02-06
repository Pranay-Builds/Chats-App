import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
