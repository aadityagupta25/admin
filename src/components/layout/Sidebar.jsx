import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Users,
    Image,
    Rss,
    Music,
    PartyPopper,
    ChevronLeft,
    ChevronRight,
    Settings,
    HelpCircle,
    Wallpaper,
    Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Users', path: '/users', icon: Users },
        { name: 'Banners', path: '/banners', icon: Image },
        { name: 'Backgrounds', path: '/backgrounds', icon: Wallpaper },
    { name: 'Gift Catalog', path: '/gifts', icon: Image },
        { name: 'Feeds', path: '/feeds', icon: Rss },
        { name: 'Party', path: '/party', icon: PartyPopper },
        { name: 'Sound Effects', path: '/sound-effect', icon: Music },
        { name: 'Batch Levels', path: '/batch-levels', icon: Trophy },
    ];

    const bottomItems = [
        { name: 'Settings', path: '/settings', icon: Settings },
        { name: 'Help', path: '/help', icon: HelpCircle },
    ]

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col",
                isOpen ? "w-64" : "w-20"
            )}
        >
            {/* Header */}
            <div className="flex items-center h-16 px-4 border-b border-sidebar-border shrink-0">
                <div className={cn("flex items-center gap-2 overflow-hidden transition-all duration-300", isOpen ? "w-full" : "w-0 opacity-0")}>
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
                        <span className="font-bold text-primary-foreground">P</span>
                    </div>
                    <span className="font-bold text-lg whitespace-nowrap">Polo Live</span>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className={cn(
                        "ml-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        !isOpen && "mx-auto"
                    )}
                >
                    {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </Button>
            </div>

            {/* Main Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
                <p className={cn("text-xs font-semibold text-sidebar-foreground/50 mb-2 px-2 uppercase tracking-wider transition-opacity", !isOpen && "opacity-0 text-center")}>
                    Menu
                </p>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group relative",
                                isActive
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                !isOpen && "justify-center px-2"
                            )
                        }
                    >
                        <item.icon size={20} className="shrink-0" />
                        <span className={cn("whitespace-nowrap transition-all duration-300", isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute left-12 hidden")}>
                            {item.name}
                        </span>

                        {/* Tooltip for collapsed state */}
                        {!isOpen && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                {item.name}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Navigation */}
            <div className="p-3 border-t border-sidebar-border mt-auto">
                {bottomItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group relative",
                                isActive
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                !isOpen && "justify-center px-2"
                            )
                        }
                    >
                        <item.icon size={20} className="shrink-0" />
                        <span className={cn("whitespace-nowrap transition-all duration-300", isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute left-12 hidden")}>
                            {item.name}
                        </span>
                    </NavLink>
                ))}
            </div>
        </aside>
    );
};

export default Sidebar;
