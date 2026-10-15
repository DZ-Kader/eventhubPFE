import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Plus, Trash2, Sparkles } from "lucide-react";

export default function CityManagement() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await axios.get("/api/cities");
      setCities(res.data);
    } catch (err) {
      console.error("Failed to fetch cities", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("/api/cities", { name, description, image });
      setSuccess("City added successfully!");
      setName("");
      setDescription("");
      setImage("");
      fetchCities();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create city.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this city?")) return;
    try {
      await axios.delete(`/api/cities/${id}`);
      fetchCities();
    } catch (err) {
      alert("Failed to delete city.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          Wilaya & City Management <MapPin className="w-5 h-5 text-indigo-400" />
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Add and manage host cities across Algerian provinces.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 h-fit">
          <h2 className="text-lg font-bold text-slate-100 mb-4">Add New City</h2>

          {error && <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">{error}</div>}
          {success && <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs">{success}</div>}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">City Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Oran"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Regional economic hub..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Image URL</label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add City
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-4">Configured Cities ({cities.length})</h2>

          {loading ? (
            <p className="text-slate-400 text-sm py-4">Loading cities...</p>
          ) : cities.length === 0 ? (
            <p className="text-slate-500 text-sm">No cities found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cities.map((city) => (
                <div key={city._id} className="p-4 bg-slate-950 border border-slate-800/80 rounded-xl flex gap-3 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={city.image || "https://images.unsplash.com/photo-1596120497556-9ef0f1712a0d?w=800&q=80"} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">{city.name}</h3>
                      <p className="text-xs text-slate-400 line-clamp-1">{city.description || "Wilaya Center"}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(city._id)}
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
