import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { Users, Calendar, Ticket, ShieldCheck, CheckCircle2, XCircle, Clock, AlertTriangle, Sparkles } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, pendingRes] = await Promise.all([
        API.get("/admin/stats"),
        API.get("/events?status=pending")
      ]);
      setStats(statsRes.data);
      setPendingEvents(pendingRes.data.events || []);
    } catch (err) {
      console.error("Failed to load admin stats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (eventId, newStatus, reason = "") => {
    try {
      await API.put(`/admin/events/${eventId}/status`, { status: newStatus, rejectionReason: reason });
      fetchAdminData();
    } catch (err) {
      console.error("Failed to update event status", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            Platform Administration <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            System moderation panel for Eventoria Algeria. Review pending event submissions and manage platform categories & venues.
          </p>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="w-5 h-5 text-indigo-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{stats?.usersCount || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Registered accounts</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Published Events</span>
            <Calendar className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{stats?.eventsCount || 0}</p>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Live on discovery
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Approvals</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{stats?.pendingCount || pendingEvents.length}</p>
          <p className="text-xs text-amber-400 mt-1">Requires admin review</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <div className="flex justify-between items-center text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Tickets</span>
            <Ticket className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-slate-100">{stats?.registrationsCount || 0}</p>
          <p className="text-xs text-slate-400 mt-1">Confirmed registrations</p>
        </div>
      </div>

      {/* Pending Moderation Queue */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Pending Submissions Queue <span className="px-2 py-0.5 text-xs bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">{pendingEvents.length}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Events submitted by organizers waiting for published status.</p>
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm py-4">Loading queue...</p>
        ) : pendingEvents.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-800 rounded-xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-slate-200 font-medium">Moderation Queue Clear</p>
            <p className="text-slate-500 text-xs mt-1">All organizer events have been reviewed.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingEvents.map((evt) => (
              <div key={evt._id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-slate-950 border border-slate-800/80 rounded-xl">
                <div className="flex items-start gap-4">
                  <img src={evt.coverImage} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h3 className="text-base font-bold text-slate-100">{evt.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Organizer: <span className="text-slate-200">{evt.organizer?.name || "TechDZ"}</span> | City: <span className="text-slate-200">{evt.city?.name}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{evt.shortDescription}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleUpdateStatus(evt._id, "published")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Publish
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(evt._id, "rejected", "Content does not meet guideline standards")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-medium transition"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
