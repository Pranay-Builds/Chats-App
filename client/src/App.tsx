import { Routes, Route } from "react-router-dom";
import Signup from "./signup";
import Landing from "./landing";
import Login from "./login";
import Home from "./home";
import Verify from "./verify";
import { ProtectedRoute } from "./components/ProtectedRoute";
import UpdatePassword from "./reset-password";
import ForgotPassword from "./forgot-password";
import { GuestRoute } from "./components/GuestRoute";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    };

    const systemPrefersDark =
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (systemPrefersDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={
        <GuestRoute>

          <Landing />
        </GuestRoute>
      } />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={
        <GuestRoute>
          <Login />
        </GuestRoute>
      } />

      <Route path="/signup" element={
        <GuestRoute>

          <Signup />
        </GuestRoute>
      } />
      <Route path="/forgot-password" element={<ForgotPassword />}></Route>
      <Route path="/reset-password" element={<UpdatePassword />}></Route>
      <Route path="/verify" element={<Verify />} />
    </Routes>
  );
}

export default App;