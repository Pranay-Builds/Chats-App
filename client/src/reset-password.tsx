import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { authClient } from "./lib/authClient";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


const UpdatePassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();


    const token = searchParams.get("token");

    if (!token) {
        return (
            <div className="min-h-screen bg-[#0d1117] text-white flex items-center justify-center">
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
            token: token || "",
        });

        setLoading(false);

        if (error) {
            toast.error(error.message || "Failed to update password");
            return;
        }

        toast.success("Password updated successfully");
        navigate("/login", { replace: true });
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
            <Navbar />

            <div className="flex items-center justify-center px-4 py-20">
                <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl backdrop-blur">

                    {/* Heading */}
                    <h1 className="text-2xl font-semibold text-center">
                        Update Password
                    </h1>

                    <p className="text-sm text-[#9ba3b4] text-center mt-2">
                        Choose a strong new password to secure your account.
                    </p>

                    {/* Form */}
                    <form onSubmit={handleUpdatePassword} className="mt-6 space-y-4">
                        <input
                            type="password"
                            placeholder="New password"
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-[#9ba3b4] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Confirm new password"
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-[#9ba3b4] focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
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
