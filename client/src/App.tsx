import { Routes, Route } from "react-router-dom";
import Signup from "./signup";
import Landing from "./landing";
import Login from "./login";
import Home from "./home";
import Verify from "./verify";
import { ProtectedRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify" element={<Verify />} />
    </Routes>
  );
}

export default App;