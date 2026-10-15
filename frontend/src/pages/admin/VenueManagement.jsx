import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { Building2, Plus, Trash2 } from "lucide-react";

export default function VenueManagement() {
  const [venues, setVenues] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [capacity, setCapacity] = useState(1000);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vRes, cRes] = await Promise.all([
        API.get("/venues"),
        API.get("/cities")
      ]);
      setVenues(vRes.data);
      setCities(cRes.data);
      if (cRes.data.length > 0) setCity(cRes.data[0]._id);
    } catch (err) {
      console.error("Failed to load venue data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await API.post("/venues", { name, city, address, capacity });
      setSuccess("Venue hall added successfully!");
      setName("");
      setAddress("");
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create venue.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this venue?")) return;
    try {
      await API.delete(`/venues/${id}`);
      fetchData();
    } catch (err) {
      alert("Failed to delete venue.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          Venue & Hall Management <Building2 className="w-5 h-5 text-indigo-400" />
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure exhibition centers, convention halls, and hotels across Algerian cities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 h-fit">
          <h2 className="text-lg font-bold text-slate-100 mb-4">Add New Venue</h2>

          {error && <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">{error}</div>}
          {success && <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs">{success}</div>}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Venue Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CIC Algiers"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">City</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              >
                {cities.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Full Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Club des Pins, Algiers"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Seat Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Venue
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-4">Registered Venues ({venues.length})</h2>

          {loading ? (
            <p className="text-slate-400 text-sm py-4">Loading venues...</p>
          ) : venues.length === 0 ? (
            <p className="text-slate-500 text-sm">No venues found.</p>
          ) : (
            <div className="space-y-3">
              {venues.map((v) => (
                <div key={v._id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800/80 rounded-xl">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{v.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{v.address} | City: <span className="text-slate-200">{v.city?.name}</span></p>
                    <p className="text-xs text-indigo-400 mt-1">Capacity: {v.capacity} seats</p>
                  </div>

                  <button
                    onClick={() => handleDelete(v._id)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
