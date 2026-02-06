import React, { useState } from "react";
import { authClient } from "../../lib/authClient";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "http://localhost:5173/reset-password",
    });

    if (error) {
      toast.error(error.message || "An unknown error occurred");
      return;
    }

    toast.success("Check your email to reset your password");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">


      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md bg-foreground/5 border border-border rounded-2xl p-8 shadow-xl">

          <h1 className="text-2xl font-semibold text-center">
            Reset Password
          </h1>

          <p className="text-sm text-foreground/60 text-center mt-2">
            Enter your email and we'll send you a reset link.
          </p>

          <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
            <input
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter your email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
