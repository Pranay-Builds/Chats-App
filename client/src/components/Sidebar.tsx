import { Home, MessageSquare, Phone, Folder, Settings, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    const navItem =
        "w-12 h-12 flex items-center justify-center rounded-xl transition hover:bg-white/10";

    const activeItem = "bg-white/10";

    return (
        <div className="h-screen w-16 bg-[#0d1117] border-r border-white/10 flex flex-col items-center py-4">

            <div className="mb-6">
                <img src="/icon.png" className="w-10 h-10 rounded-lg" />
            </div>

            {/* MAIN NAV */}
            <div className="flex flex-col gap-3 flex-1">
                <NavLink
                    to="/home"
                    className={({ isActive }) =>
                        `${navItem} ${isActive ? activeItem : ""}`
                    }
                >
                    <Home size={20} />
                </NavLink>

                <NavLink
                    to="/messages"
                    className={({ isActive }) =>
                        `${navItem} ${isActive ? activeItem : ""}`
                    }
                >
                    <MessageSquare size={20} />
                </NavLink>

                <NavLink
                    to="/calls"
                    className={({ isActive }) =>
                        `${navItem} ${isActive ? activeItem : ""}`
                    }
                >
                    <Phone size={20} />
                </NavLink>

                <NavLink
                    to="/files"
                    className={({ isActive }) =>
                        `${navItem} ${isActive ? activeItem : ""}`
                    }
                >
                    <Folder size={20} />
                </NavLink>
            </div>

            {/* BOTTOM SETTINGS */}
            <div className="mt-auto flex flex-col gap-3 items-center">
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `${navItem} ${isActive ? activeItem : ""}`
                    }
                >
                    <Settings size={20} />
                </NavLink>

                <button className={`${navItem} cursor-pointer`}>
                    <Sun size={20}/>
                </button>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `${navItem} ${isActive ? activeItem : ""}`
                    }
                >
                    <img
                        className="w-10 h-10 rounded-full border border-white/20"
                        src="https://i.ibb.co/6cc19GgX/pranah.jpg"
                    />
                </NavLink>
                
            </div>
        </div>
    );
}
