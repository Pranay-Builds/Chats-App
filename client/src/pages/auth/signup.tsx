import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import google_logo from "../../assets/google.png"
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { authClient } from "../../lib/authClient";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = email.includes("@") && email.includes(".");
  const isDisabled =
    loading ||
    name.length < 3 ||
    password.length < 8 ||
    !isValidEmail ||
    !email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("Check your email to verify your account");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      

      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-6">
        {/* CARD */}
        <div className="w-full max-w-sm rounded-xl bg-foreground/5 border border-border p-6 text-center animate-in fade-in zoom-in duration-300">

          <img
            src="/icon.png"
            className="w-16 h-16 mx-auto rounded-xl"
            alt="Chats logo"
          />

          <h1 className="mt-4 font-semibold text-2xl">
            Create your Chats account
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="mt-6 space-y-4 text-left">

              {/* NAME */}
              <div className="relative">
                {name.length > 0 && (
                  <span className="absolute left-3 -bottom-4 px-1 text-sm text-foreground/50">
                    {name.length}/25
                  </span>
                )}
                <input
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  minLength={3}
                  maxLength={25}
                  required
                />
              </div>

              {/* EMAIL */}
              <input
                className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                required
              />

              {/* PASSWORD */}
              <div className="relative">
                {password.length > 0 && (
                  <button
                    className="absolute right-4 top-3"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {!showPassword ? (
                      <Eye className="text-foreground/50" />
                    ) : (
                      <EyeClosed className="text-foreground/50" />
                    )}
                  </button>
                )}

                <input
                  className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  required
                />
              </div>

              <p className="text-xs text-foreground/60">
                At least 8 characters
              </p>
            </div>

            <button
              className="mt-4 w-full py-2.5 rounded-lg bg-blue-500 font-medium text-white hover:bg-blue-600 transition disabled:opacity-50"
              disabled={isDisabled}
              type="submit"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {/* DIVIDER */}
          <div className="relative my-6 w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide">
              <span className="bg-background px-3 text-foreground/60">
                Or
              </span>
            </div>
          </div>

          {/* GOOGLE BUTTON */}
          <button
            type="button"
            onClick={() =>
              authClient.signIn.social({
                provider: "google",
                callbackURL: "http://localhost:5173",
              })
            }
            className="w-full flex items-center justify-center gap-3 rounded-lg border border-border py-2.5 text-sm font-medium hover:bg-foreground/5 transition"
          >
            <img src={google_logo} className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>

          <p className="mt-4 text-xs text-foreground/60">
            By continuing, you agree to our{" "}
            <span className="underline cursor-pointer">Terms</span> &{" "}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>

          <p className="mt-6 text-sm text-foreground/60">
            Already have an account?{" "}
            <Link to="/login" className="text-foreground hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
