import React, { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, Settings, BarChart3, ShieldCheck, MapPin, Tags, Star, Menu, Bell, Search, Globe, LogOut } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout({ role }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  // If auth is loading, show spinner
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-primary">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login
  if (!user) {
    // We defer using useEffect or just trigger it immediately in render
    setTimeout(() => navigate("/login"), 50);
    return null;
  }

  // If user has wrong role, redirect to public homepage
  if (user.role !== role && user.role !== "admin") {
    setTimeout(() => navigate("/"), 50);
    return null;
  }

  const organizerNav = [
    { name: "Dashboard", href: "/organizer", icon: LayoutDashboard },
    { name: "My Events", href: "/organizer/events", icon: Calendar },
    { name: "Registrations", href: "/organizer/registrations", icon: Users },
    { name: "Analytics", href: "/organizer/analytics", icon: BarChart3 },
    { name: "Organization Profile", href: "/organizer/profile", icon: Settings },
  ];

  const adminNav = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Pending Events", href: "/admin/moderation", icon: ShieldCheck },
    { name: "All Events", href: "/admin/events", icon: Calendar },
    { name: "User Management", href: "/admin/users", icon: Users },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "Cities", href: "/admin/cities", icon: MapPin },
    { name: "Venues", href: "/admin/venues", icon: Star },
  ];

  const userNav = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Tickets", href: "/dashboard/tickets", icon: Tags },
    { name: "Favorites", href: "/dashboard/favorites", icon: Star },
    { name: "Profile", href: "/dashboard/profile", icon: Settings },
  ];

  const navigation = role === "admin" ? adminNav : role === "organizer" ? organizerNav : userNav;
  const brandTitle = role === "admin" ? "EVENTORIA ADMIN" : role === "organizer" ? "EVENTORIA ORGANIZER" : "MY DASHBOARD";


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Sidebar Desktop */}
      <aside className="hidden w-64 flex-col border-r border-border bg-slate-950 md:flex">
        <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
          <Link to="/" className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="text-sm font-bold tracking-tight text-slate-100 uppercase">{brandTitle}</span>
          </Link>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4 justify-between">
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-800 text-primary"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 shrink-0",
                      isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-200"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="pt-6 border-t border-border space-y-1">
            <Link
              to="/"
              className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
            >
              <Globe className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-200" />
              Back to Public Site
            </Link>
            <button
              onClick={handleLogout}
              className="w-full group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-rose-400 hover:bg-slate-800 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="mr-3 h-5 w-5 text-rose-400" />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Column */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-slate-950 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-2 p-2 text-slate-400 hover:text-slate-100 cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-sm font-bold text-slate-100 uppercase">{brandTitle}</span>
          </div>
          
          <div className="flex flex-1 justify-end items-center gap-4">
            <div className="h-px bg-slate-800 w-4"></div>
            <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-3 py-1 rounded-full uppercase">
              {user.name} ({user.role})
            </span>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {role === "admin" ? "A" : "O"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-slate-900 border-r border-border">
            <div className="flex h-16 shrink-0 items-center px-6 border-b border-border justify-between">
              <span className="text-sm font-bold tracking-tight text-slate-100 uppercase">{brandTitle}</span>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4 justify-between">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="group flex items-center rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                  >
                    <item.icon className="mr-4 h-6 w-6 text-slate-400" />
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="pt-6 border-t border-border space-y-1">
                <Link
                  to="/"
                  onClick={() => setSidebarOpen(false)}
                  className="group flex items-center rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-100"
                >
                  <Globe className="mr-4 h-6 w-6 text-slate-400" />
                  Back to Public Site
                </Link>
                <button
                  onClick={() => { handleLogout(); setSidebarOpen(false); }}
                  className="w-full text-left group flex items-center rounded-lg px-3 py-2 text-base font-medium text-rose-400 hover:bg-slate-800 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <LogOut className="mr-4 h-6 w-6 text-rose-400" />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
