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
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6">
        {/* CARD */}
        <div className="w-full max-w-sm rounded-xl bg-foreground/5 border border-border p-6 text-center">

          <img src="/icon.png" className="w-20 h-20 mx-auto" />

          <h1 className="mt-4 font-semibold text-2xl">
            Log in to Chats
          </h1>

          <form onSubmit={handleSubmit}>
            {/* EMAIL */}
            <input
              className="mt-6 w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* PASSWORD */}
            <input
              className="mt-3 w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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

          <p className="text-left mt-2 text-foreground/60">
            <Link to="/forgot-password">Forgot password?</Link>
          </p>

          {/* DIVIDER */}
          <div className="relative my-6 w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide">
              <span className="bg-background px-3 text-foreground/60">
                Or continue with
              </span>
            </div>
          </div>

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            onClick={() =>
              authClient.signIn.social({
                provider: "google",
                callbackURL: "http://localhost:5173"
              })
            }
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-border py-2.5 text-sm font-medium hover:bg-foreground/5 transition"
          >
            <img src={google_logo} className="w-5 h-5" />
            Continue with Google
          </button>

          <p className="mt-6 text-sm text-foreground/60">
            Don't have an account?{" "}
            <Link to="/signup" className="text-foreground hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
