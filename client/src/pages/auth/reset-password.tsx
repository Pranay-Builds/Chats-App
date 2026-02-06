import React, { useState } from "react";
import { authClient } from "../../lib/authClient";
import { toast } from "sonner";
import { useSearchParams, useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        Invalid or expired reset link.
      </div>
    );
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message || "Failed to update password");
      return;
    }

    toast.success("Password updated successfully");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">


      <div className="flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md bg-foreground/5 border border-border rounded-2xl p-8 shadow-xl">

          <h1 className="text-2xl font-semibold text-center">
            Update Password
          </h1>

          <p className="text-sm text-foreground/60 text-center mt-2">
            Choose a strong new password to secure your account.
          </p>

          <form onSubmit={handleUpdatePassword} className="mt-6 space-y-4">
            <input
              type="password"
              placeholder="New password"
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-4 py-3 rounded-lg bg-background border border-border text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium disabled:opacity-60"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
