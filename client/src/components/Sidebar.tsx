import { Home, MessageSquare, Phone, Folder, Settings, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Avatar from "./Avatar";
import { useUser } from "../store/useUser";

export default function Sidebar() {
    const [darkMode, setIsDarkMode] = useState<boolean>(false);
    const { user } = useUser();

    const navItem =
        "w-12 h-12 flex items-center justify-center rounded-xl transition hover:bg-foreground/10";
    const activeItem = "bg-foreground/10";


    const toggleTheme = () => {
        const html = document.documentElement;
        html.classList.toggle("dark");

        const isDark = html.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light")

        setIsDarkMode(isDark);
    };

    useEffect(() => {
        const isDark = document.documentElement.classList.contains("dark");
        setIsDarkMode(isDark);
    }, [])


    return (
        <div className="h-screen w-16 bg-background text-foreground border-r border-border flex flex-col items-center py-4">

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

            {/* BOTTOM SECTION */}
            <div className="mt-auto flex flex-col gap-3 items-center">
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        `${navItem} ${isActive ? activeItem : ""}`
                    }
                >
                    <Settings size={20} />
                </NavLink>

                <button className={navItem} onClick={toggleTheme}>
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `${navItem} ${isActive ? activeItem : ""}`
                    }
                >
                    <Avatar
                        name={user?.name}
                        image={user?.image}
                    />
                </NavLink>
            </div>
        </div>
    );
}
