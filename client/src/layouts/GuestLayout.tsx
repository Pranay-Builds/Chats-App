import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function GuestLayout() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Navbar />
      <Outlet />
    </div>
  );
}
