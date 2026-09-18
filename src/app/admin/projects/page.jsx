"use client";

import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSelector,
} from "react-icons/hi";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    year: "",
    image: "",
    description: "",
    challenge: "",
    improvements: "",
    liveUrl: "",
    githubUrl: "",
    tags: "",
  });

  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: "",
      category: "Full Stack",
      year: new Date().getFullYear().toString(),
      image: "",
      description: "",
      challenge: "",
      improvements: "",
      liveUrl: "",
      githubUrl: "",
      tags: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      category: project.category || "",
      year: project.year || "",
      image: project.image || "",
      description: project.description || "",
      challenge: project.challenge || "",
      improvements: project.improvements || "",
      liveUrl: project.liveUrl || "",
      githubUrl: project.githubUrl || "",
      tags: Array.isArray(project.tags) ? project.tags.join(", ") : project.tags || "",
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      id: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      tags: formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    };

    try {
      let res;
      if (editingProject) {
        res = await fetch(`/api/admin/projects/${editingProject._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        fetchProjects();
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const list = [...projects];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setProjects(list);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const reorderedList = projects.map((p, idx) => ({
      id: p._id,
      order: idx,
    }));

    try {
      await fetch("/api/admin/projects/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reorderedList),
      });
    } catch (err) {
      console.error("Reorder save failed:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1a1a1a]">Projects Showcase</h1>
          <p className="mt-1 text-sm font-medium text-black/50">Drag items to rearrange public sorting order</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#ff5f1a] hover:bg-[#e04d0d] text-xs font-bold text-white shadow-md shadow-[#ff5f1a]/20 transition active:scale-[0.98] self-start sm:self-auto"
        >
          <HiOutlinePlus className="text-lg" /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white border border-black/8 animate-pulse shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="border border-black/8 bg-white rounded-3xl overflow-hidden shadow-sm">
          {projects.length === 0 ? (
            <div className="p-12 text-center text-black/40 text-sm font-medium">
              No projects added yet. Click "Add Project" to get started.
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {projects.map((project, idx) => (
                <div
                  key={project._id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between p-4 sm:p-5 transition hover:bg-black/3 ${
                    draggedIndex === idx ? "opacity-35 bg-black/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="cursor-grab text-black/30 hover:text-[#ff5f1a] p-1 transition active:cursor-grabbing">
                      <HiOutlineSelector className="text-xl" />
                    </span>
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-12 h-12 rounded-xl object-cover bg-black/4 border border-black/8 hidden sm:block"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#1a1a1a] truncate">{project.title}</span>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-black/4 border border-black/8 text-black/60">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-xs text-black/50 truncate max-w-lg mt-1 font-normal">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(project)}
                      className="p-2 text-black/50 hover:text-[#1a1a1a] rounded-xl hover:bg-black/5 transition"
                    >
                      <HiOutlinePencil className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="p-2 text-black/40 hover:text-red-600 rounded-xl hover:bg-red-500/10 transition"
                    >
                      <HiOutlineTrash className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-start">
          <div className="relative w-full max-w-4xl bg-white border border-black/10 rounded-3xl p-6 sm:p-8 my-8 shadow-2xl">
            <h2 className="text-2xl font-extrabold text-[#1a1a1a] mb-6">
              {editingProject ? "Edit Project Details" : "Create New Project"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Title, Category, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Taskly"
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5f1a]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5f1a]/20"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Design">Design</option>
                    <option value="UI Library">UI Library</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                    Release Year
                  </label>
                  <input
                    type="text"
                    required
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g. 2026"
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5f1a]/20"
                  />
                </div>
              </div>

              {/* Row 2: Image URL, Tech tags */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                    Mockup Image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/mockup.png"
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5f1a]/20"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                    Tags / Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Next.js, React, Tailwind CSS, MongoDB"
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5f1a]/20"
                  />
                </div>
              </div>

              {/* Row 3: Short Description */}
              <div>
                <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                  Short Description
                </label>
                <textarea
                  required
                  name="description"
                  rows={2}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="A brief overview of the project scope and purpose..."
                  className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5f1a]/20"
                />
              </div>

              {/* Row 4: Challenges & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                    Development Challenges
                  </label>
                  <textarea
                    name="challenge"
                    rows={3}
                    value={formData.challenge}
                    onChange={handleInputChange}
                    placeholder="What was the main engineering challenge you solved?"
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5f1a]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                    Future Improvements
                  </label>
                  <textarea
                    name="improvements"
                    rows={3}
                    value={formData.improvements}
                    onChange={handleInputChange}
                    placeholder="What would you add or refactor in future versions?"
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5f1a]/20"
                  />
                </div>
              </div>

              {/* Row 5: Live URL, Github URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                    Live Booking / App URL
                  </label>
                  <input
                    type="url"
                    name="liveUrl"
                    value={formData.liveUrl}
                    onChange={handleInputChange}
                    placeholder="https://myproject.com"
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5f1a]/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-black/50 mb-2">
                    GitHub Code Repository URL
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/Zabedfolio/..."
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff5f1a]/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t border-black/8">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-2xl border border-black/10 bg-black/4 text-xs font-bold text-[#1a1a1a] hover:bg-black/8 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#ff5f1a] hover:bg-[#e04d0d] text-xs font-bold text-white transition active:scale-[0.98] disabled:opacity-50 shadow-md shadow-[#ff5f1a]/20"
                >
                  {saving ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Save Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
