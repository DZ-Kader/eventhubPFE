import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { 
  Calendar, 
  Users, 
  Eye, 
  Plus, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileEdit,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const res = await API.get("/events/mine");
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to load organizer events", err);
    } finally {
      setLoading(false);
    }
  };

  const totalViews = events.reduce((sum, e) => sum + (e.views || 0), 0);
  const totalAttendees = events.reduce((sum, e) => sum + (e.currentAttendees || 0), 0);
  const publishedCount = events.filter((e) => e.status === "published").length;
  const pendingCount = events.filter((e) => e.status === "pending").length;

  const chartData = [
    { name: "Mon", views: 240, attendees: 45 },
    { name: "Tue", views: 380, attendees: 68 },
    { name: "Wed", views: 510, attendees: 95 },
    { name: "Thu", views: 420, attendees: 80 },
    { name: "Fri", views: 680, attendees: 140 },
    { name: "Sat", views: 890, attendees: 210 },
    { name: "Sun", views: 730, attendees: 175 },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            Organizer Dashboard <Sparkles className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your Algerian event listings, monitor attendee registrations and submit new drafts for review.
          </p>
        </div>
        <Link
          to="/organizer/create-event"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium px-4 py-2.5 rounded-xl text-sm transition shadow-lg shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" /> Create New Event
        </Link>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Events</span>
            <Calendar className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{events.length}</p>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {publishedCount} Live on platform
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Attendees</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{totalAttendees}</p>
          <p className="text-xs text-slate-400 mt-1">Across all published events</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Views</span>
            <Eye className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{totalViews}</p>
          <p className="text-xs text-slate-400 mt-1">Impressions on Eventoria</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Review</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{pendingCount}</p>
          <p className="text-xs text-slate-400 mt-1">Awaiting admin moderation</p>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Weekly Visitor Analytics</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "0.75rem", color: "#f8fafc" }}
              />
              <Area type="monotone" dataKey="views" stroke="#6366f1" fillOpacity={1} fill="url(#colorViews)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-100">My Events Catalog</h2>
          <Link to="/organizer/events" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
            View All →
          </Link>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm py-4">Loading your events...</p>
        ) : events.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-medium">No events created yet</p>
            <p className="text-slate-500 text-xs mt-1 mb-4">Start by publishing your first Algerian tech or agricultural event</p>
            <Link
              to="/organizer/create-event"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-4 py-2 rounded-xl text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Create Event
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Event Title</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Attendees</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {events.slice(0, 5).map((evt) => (
                  <tr key={evt._id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4 font-medium text-slate-100 flex items-center gap-3">
                      <img src={evt.coverImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="line-clamp-1">{evt.title}</p>
                        <p className="text-xs text-slate-500">{new Date(evt.startDate).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{evt.city?.name || "Algeria"}</td>
                    <td className="py-3.5 px-4">
                      {evt.status === "published" && (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Live
                        </span>
                      )}
                      {evt.status === "pending" && (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <Clock className="w-3 h-3" /> Pending Review
                        </span>
                      )}
                      {evt.status === "draft" && (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          <FileEdit className="w-3 h-3" /> Draft
                        </span>
                      )}
                      {evt.status === "rejected" && (
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <XCircle className="w-3 h-3" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-semibold">
                      {evt.currentAttendees || 0} / {evt.capacity}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={`/events/${evt.slug || evt._id}`}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Preview
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
