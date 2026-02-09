import { Routes, Route } from "react-router-dom";
import Signup from "./pages/auth/signup";
import Landing from "./pages/landing";
import Login from "./pages/auth/login";
import Home from "./pages/home";
import Verify from "./pages/auth/verify";
import { ProtectedRoute } from "./components/ProtectedRoute";
import UpdatePassword from "./pages/auth/reset-password";
import ForgotPassword from "./pages/auth/forgot-password";
import { GuestRoute } from "./components/GuestRoute";
import { useEffect } from "react";
import GuestLayout from "./layouts/GuestLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Profile from "./pages/profile";
import { useUser } from "./store/useUser";
import { authClient } from "./lib/authClient";

function App() {
  const { setUser, fetchProfile } = useUser();
  const { data: session, isPending } = authClient.useSession();
  console.log("User is: " + session?.user)

  useEffect(() => {
    if (!isPending && session?.user) {
      fetchProfile();
    }
  }, [session, isPending, fetchProfile]);


  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    };
  }, []);

  return (
    <Routes>

      {/* GUEST ROUTES */}
      <Route element={<GuestRoute />}>
        <Route element={<GuestLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/update-password" element={<UpdatePassword />} />
        </Route>
      </Route>

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

    </Routes>
  );
}

export default App;