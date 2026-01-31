import Navbar from "./components/Navbar";
import google_logo from "./assets/google.png"
import { Link } from "react-router-dom";

function Signup() {
    return (
        <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">

            {/* NAV */}
            <Navbar />

            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6">
                <div className="w-full max-w-sm rounded-xl bg-white/5 border border-white/10 p-6 text-center">
                    <img src="/icon.png" className="w-20 h-20 mx-auto" />

                    <h1 className="mt-4 font-semibold text-2xl">
                        Sign up on Chats
                    </h1>

                    <input
                        className="mt-6 w-full px-4 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-[#9ba3b4] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Email or username"
                    />

                    <button className="mt-4 w-full py-2.5 rounded-lg bg-blue-500 font-medium hover:bg-blue-600 transition">
                        Continue
                    </button>


                    <div className="relative my-6 w-full">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-wide">
                            <span className="bg-[#0d1117] px-3 text-[#9ba3b4]">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Google button */}
                    <button className="w-full flex items-center justify-center gap-3 rounded-lg border border-white/20 bg-transparent py-2.5 text-sm font-medium hover:bg-white/5 transition">
                        <img src={google_logo} className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <p className="mt-4 text-xs text-[#9ba3b4]">
                        By continuing, you agree to our Terms & Privacy Policy.
                    </p>

                    <p className="mt-6 text-sm text-[#9ba3b4]">
                        Already have an account?{" "}
                        <Link to="/login">
                            <span className="text-white hover:underline cursor-pointer">
                                Log in
                            </span>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;