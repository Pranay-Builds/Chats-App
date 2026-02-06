import Navbar from "./components/Navbar";
import google_logo from "./assets/google.png";
import { Link, useNavigate } from "react-router-dom";
import { authClient } from "./lib/authClient";
import { toast } from "sonner";
import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Logged in successfully");
    navigate("/home", { replace: true });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6">
        <div className="w-full max-w-sm rounded-xl bg-white/5 border border-white/10 p-6 text-center">
          <img src="/icon.png" className="w-20 h-20 mx-auto" />

          <h1 className="mt-4 font-semibold text-2xl">
            Log in to Chats
          </h1>

          <form onSubmit={handleSubmit}>
            <input
              className="mt-6 w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-[#9ba3b4] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="mt-3 w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-[#9ba3b4] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full py-2.5 rounded-lg bg-blue-500 font-medium hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Continue"}
            </button>
          </form>

          <p className="text-left mt-2 text-gray-400 cursor-pointer">
            <Link to="/reset-password">Forgot password?</Link>
          </p>

          <div className="relative my-6 w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide">
              <span className="bg-[#0d1117] px-3 text-[#9ba3b4]">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={() =>
              authClient.signIn.social({ provider: "google", callbackURL: "http://localhost:5173" })
            }
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-white/20 bg-transparent py-2.5 text-sm font-medium hover:bg-white/5 transition"
          >
            <img src={google_logo} className="w-5 h-5" />
            Continue with Google
          </button>

          <p className="mt-6 text-sm text-[#9ba3b4]">
            Don't have an account?{" "}
            <Link to="/signup" className="text-white hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
