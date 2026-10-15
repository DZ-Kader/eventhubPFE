import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, Calendar, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "../components/ui";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isHome = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-slate-100">
      {/* Header */}
      <header className={cn("sticky top-0 z-50 w-full border-b border-border bg-slate-950/95 backdrop-blur-md", {
        "border-transparent": isHome
      })}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              <span className="text-xl font-extrabold tracking-tight text-slate-100 font-sans">
                EVENT<span className="text-primary">ORIA</span>
              </span>
            </Link>
            <nav className="ml-10 hidden md:flex space-x-8">
              <Link to="/discover" className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">
                Discover Events
              </Link>
              <Link to="/discover?tab=categories" className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">
                Categories
              </Link>
              <Link to="/discover?tab=cities" className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">
                Cities
              </Link>
              <Link to="/organizer" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                For Organizers
              </Link>
            </nav>
          </div>
          
          <div className="hidden items-center space-x-4 md:flex">
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === "admin" && (
                  <Link to="/admin" className="text-sm font-medium text-slate-400 hover:text-primary flex items-center gap-1.5">
                    <LayoutDashboard className="h-4 w-4" /> Admin Portal
                  </Link>
                )}
                {user.role === "organizer" && (
                  <Link to="/organizer" className="text-sm font-medium text-slate-400 hover:text-primary flex items-center gap-1.5">
                    <LayoutDashboard className="h-4 w-4" /> Organizer Portal
                  </Link>
                )}
                {user.role === "user" && (
                  <Link to="/dashboard" className="text-sm font-medium text-slate-400 hover:text-primary flex items-center gap-1.5">
                    <User className="h-4 w-4" /> My Account
                  </Link>
                )}
                <div className="h-px bg-slate-800 w-4"></div>
                <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full uppercase">
                  {user.name.split(" ")[0]} ({user.role})
                </span>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer" title="Log Out">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">
                  Sign In
                </Link>
                <Button asChild variant="outline" size="sm">
                  <Link to="/register">Sign Up</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/organizer/events/new">Create Event</Link>
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-slate-900 px-4 py-3 space-y-3">
          <Link to="/discover" onClick={() => setMobileMenuOpen(false)} className="block rounded-md py-2 text-base font-medium text-slate-100 hover:bg-slate-800 hover:text-primary">Discover Events</Link>
          <Link to="/discover?tab=categories" onClick={() => setMobileMenuOpen(false)} className="block rounded-md py-2 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-100">Categories</Link>
          <Link to="/discover?tab=cities" onClick={() => setMobileMenuOpen(false)} className="block rounded-md py-2 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-100">Cities</Link>
          <Link to="/organizer" onClick={() => setMobileMenuOpen(false)} className="block rounded-md py-2 text-base font-medium text-blue-400 hover:bg-slate-800">For Organizers</Link>
          
          <div className="h-px bg-slate-800 my-2"></div>
          
          {user ? (
            <div className="space-y-2">
              <div className="text-xs text-slate-400 font-bold px-2">Signed in as: {user.name} ({user.role})</div>
              {user.role === "admin" && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="block rounded-md py-2 px-2 text-base font-medium text-slate-100 hover:bg-slate-800">Admin Portal</Link>
              )}
              {user.role === "organizer" && (
                <Link to="/organizer" onClick={() => setMobileMenuOpen(false)} className="block rounded-md py-2 px-2 text-base font-medium text-slate-100 hover:bg-slate-800">Organizer Portal</Link>
              )}
              {user.role === "user" && (
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block rounded-md py-2 px-2 text-base font-medium text-slate-100 hover:bg-slate-800">My Dashboard</Link>
              )}
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left block rounded-md py-2 px-2 text-base font-medium text-rose-400 hover:bg-slate-800 cursor-pointer">Log Out</button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-base font-medium text-slate-300 hover:text-slate-100">Sign In</Link>
              <Button asChild className="w-full">
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Register</Link>
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 py-12 text-slate-400 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="text-xl font-extrabold tracking-tight text-slate-100">EVENTORIA</span>
              </div>
              <p className="mt-4 text-sm text-slate-500">
                The Event Hub of Algeria.<br/>
                Discover professional events, exhibitions, and conferences.
              </p>
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Discover</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/discover" className="text-sm hover:text-slate-100 transition-colors">Events</Link></li>
                <li><Link to="/discover?tab=categories" className="text-sm hover:text-slate-100 transition-colors">Categories</Link></li>
                <li><Link to="/discover?tab=cities" className="text-sm hover:text-slate-100 transition-colors">Cities</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">Organizers</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/organizer/events/new" className="text-sm hover:text-slate-100 transition-colors">Create Event</Link></li>
                <li><Link to="/organizer" className="text-sm hover:text-slate-100 transition-colors">Organizer Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase">PFE Demo Portals</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/login" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">➜ Visitor Login</Link></li>
                <li><Link to="/organizer" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">➜ Organizer Portal</Link></li>
                <li><Link to="/admin" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">➜ Admin Portal</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} Eventoria Algeria. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span className="text-xs text-slate-400 hover:text-white cursor-pointer">Privacy Policy</span>
              <span className="text-xs text-slate-400 hover:text-white cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
