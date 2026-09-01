"use client";

import { useState, useEffect } from "react";
import { Tags, Plus, Trash2, X, Loader2, Folder } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#3B82F6");
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/categories");
      const data = await res.json();
      if (res.ok) {
        setCategories(data.categories || []);
      } else {
        setError(data.error || "Failed to fetch categories");
      }
    } catch (err) {
      setError("Network error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, color }),
      });
      const data = await res.json();
      if (res.ok) {
        setModalOpen(false);
        setName("");
        setDescription("");
        setColor("#3B82F6");
        fetchCategories();
      } else {
        alert(data.error || "Failed to create category");
      }
    } catch (err) {
      alert("Error creating category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id, catName) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`))
      return;
    try {
      const res = await fetch(`/api/v1/admin/categories?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchCategories();
      } else {
        alert("Failed to delete category");
      }
    } catch (err) {
      alert("Error deleting category");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-950 tracking-tight flex items-center gap-2">
            <Tags className="w-6 h-6 text-emerald-600" />
            Categories & Taxonomy
          </h1>
          <p className="text-xs text-slate-500">
            Manage global content categories and taxonomy classifications across
            the platform.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs shadow-md shadow-slate-950/10 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Category Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-600 mb-2" />
          <p className="text-xs">Loading global categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center text-slate-400 space-y-3 shadow-xs">
          <Folder className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-medium text-slate-600">
            No categories created yet.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold shadow-xs"
          >
            Create First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-4 h-4 rounded-full border border-slate-200 shadow-xs"
                      style={{ backgroundColor: cat.color || "#3B82F6" }}
                    />
                    <h3 className="font-extrabold text-base text-slate-950 tracking-tight">
                      {cat.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleDeleteCategory(cat._id, cat.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 min-h-8 font-medium leading-relaxed">
                  {cat.description ||
                    "Global platform content topic classification."}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <span>
                  Slug:{" "}
                  <strong className="text-emerald-700 font-bold">
                    /{cat.slug}
                  </strong>
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-sans font-bold">
                  Global
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Creating Category */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
                <Tags className="w-5 h-5 text-emerald-600" />
                Add Category
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Short description of this category topic..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-semibold">
                  Color Accent
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                  <span className="font-mono text-slate-600 font-medium">
                    {color}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-bold shadow-md shadow-slate-950/10"
                >
                  {submitting ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
