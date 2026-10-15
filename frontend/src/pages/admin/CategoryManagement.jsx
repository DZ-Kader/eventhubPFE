import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { Tag, Plus, Trash2, Edit2, Sparkles, CheckCircle } from "lucide-react";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("tag");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await API.post("/categories", { name, description, icon });
      setSuccess("Category added successfully!");
      setName("");
      setDescription("");
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create category.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert("Failed to delete category.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          Category Management <Tag className="w-5 h-5 text-indigo-400" />
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Add, view, and manage event classification categories across Algeria.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 h-fit">
          <h2 className="text-lg font-bold text-slate-100 mb-4">Add New Category</h2>
          
          {error && <div className="p-3 mb-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">{error}</div>}
          {success && <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs">{success}</div>}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cybersecurity"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief category overview..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-slate-100 mb-4">Existing Categories ({categories.length})</h2>

          {loading ? (
            <p className="text-slate-400 text-sm py-4">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-slate-500 text-sm">No categories found.</p>
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat._id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800/80 rounded-xl">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{cat.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{cat.description || "No description provided."}</p>
                    <span className="inline-block text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded mt-2 border border-indigo-500/20">
                      slug: {cat.slug}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-2 text-slate-500 hover:text-rose-400 transition"
                    title="Delete Category"
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
