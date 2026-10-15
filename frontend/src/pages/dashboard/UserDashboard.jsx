import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Ticket, Heart, Calendar, MapPin, QrCode, Sparkles, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function UserDashboard() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [regRes, favRes] = await Promise.all([
        axios.get("/api/registrations/my-tickets"),
        axios.get("/api/favorites")
      ]);
      setRegistrations(regRes.data);
      setFavorites(favRes.data);
    } catch (err) {
      console.error("Failed to load user dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            Welcome back, {user?.name || "Visitor"}! <Sparkles className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            View your event passes, ticket QR codes, and saved events in Algeria.
          </p>
        </div>
        <Link
          to="/discover"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition"
        >
          Explore Events →
        </Link>
      </div>

      {/* Digital Tickets Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-4">
          <Ticket className="w-5 h-5 text-indigo-400" /> My Digital Event Passes ({registrations.length})
        </h2>

        {loading ? (
          <p className="text-slate-400 text-sm py-4">Loading your tickets...</p>
        ) : registrations.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
            <Ticket className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-300 font-medium">No active event tickets</p>
            <p className="text-slate-500 text-xs mt-1 mb-4">Explore upcoming events and reserve your digital pass.</p>
            <Link to="/discover" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
              Browse Discover Hub →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registrations.map((reg) => (
              <div key={reg._id} className="relative bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-600/20 text-indigo-300 text-[10px] font-bold tracking-wider px-3 py-1 rounded-bl-xl border-b border-l border-indigo-500/30 uppercase">
                  Confirmed Pass
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-100 pr-16">{reg.event?.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{new Date(reg.event?.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{reg.event?.city?.name || "Algeria"}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Ticket Reference</p>
                    <p className="font-mono text-sm font-bold text-indigo-300">{reg.ticketCode}</p>
                  </div>
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg flex items-center gap-1.5 text-xs text-slate-300">
                    <QrCode className="w-5 h-5 text-indigo-400" /> Pass QR
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Favorites Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-rose-400" /> Saved Favorite Events ({favorites.length})
        </h2>

        {favorites.length === 0 ? (
          <p className="text-slate-500 text-sm">No saved events yet. Click the heart icon on any event to bookmark it.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((evt) => (
              <Link
                key={evt._id}
                to={`/events/${evt.slug || evt._id}`}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex gap-3 hover:border-slate-700 transition"
              >
                <img src={evt.coverImage} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <h4 className="text-sm font-bold text-slate-100 line-clamp-1">{evt.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{evt.city?.name}</p>
                  <p className="text-[11px] text-indigo-400 mt-1 font-medium">View Event →</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
