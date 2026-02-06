import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-6 py-4 sticky top-0 z-50">

            <Link to="/">
                <div className="flex items-center">
                    <img src="/icon.png" className="w-10 h-10" />
                    <span className="ml-2 text-xl font-semibold">Chats</span>
                </div>
            </Link>


            <div className="flex items-center gap-4">
                <Link to="/login">
                    <button className="text-sm text-foreground/60
hover:text-foreground
 transition">
                        Log in
                    </button>
                </Link>
                <Link to="/signup">
                    <button className="text-sm px-4 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition">
                        Sign up
                    </button>
                </Link>
            </div>
        </nav>
    )
}

export default Navbar