"use client";

import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSelector,
} from "react-icons/hi";

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Frontend",
    icon: "",
    color: "#ffffff",
    percentage: 80,
  });

  // Drag State
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch("/api/admin/skills");
      const data = await res.json();
      if (Array.isArray(data)) {
        setSkills(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      category: "Frontend",
      icon: "",
      color: "#ffffff",
      percentage: 80,
    });
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || "",
      category: skill.category || "Frontend",
      icon: skill.icon || "",
      color: skill.color || "#ffffff",
      percentage: skill.percentage !== undefined ? skill.percentage : 80,
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "percentage" ? (parseInt(value, 10) || 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      let res;
      if (editingSkill) {
        res = await fetch(`/api/admin/skills/${editingSkill._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/admin/skills", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        fetchSkills();
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;

    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSkills((prev) => prev.filter((s) => s._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Drag and Drop
  const handleDragStart = (idx) => {
    setDraggedIndex(idx);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const list = [...skills];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setSkills(list);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const reorderedList = skills.map((s, idx) => ({
      id: s._id,
      order: idx,
    }));

    try {
      await fetch("/api/admin/skills/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reorderedList),
      });
    } catch (err) {
      console.error("Failed saving skill order:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">Skills Directory</h1>
          <p className="mt-2 text-sm text-black/50">Rearrange skills shown in the Skills section</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#ff5f1a] hover:bg-[#e04d0d] text-sm font-semibold text-white transition active:scale-[0.98] shadow-sm self-start sm:self-auto"
        >
          <HiOutlinePlus className="text-lg" /> Add Skill
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white border border-black/8 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {skills.length === 0 ? (
            <div className="col-span-full p-12 text-center text-black/40 text-sm bg-white rounded-2xl border border-black/8">
              No skills found. Click "Add Skill" to create one.
            </div>
          ) : (
            skills.map((skill, idx) => (
              <div
                key={skill._id}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between p-4 rounded-2xl bg-white border border-black/8 shadow-sm transition hover:border-black/20 ${
                  draggedIndex === idx ? "opacity-35 bg-black/5" : ""
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="cursor-grab text-black/30 hover:text-[#ff5f1a] transition active:cursor-grabbing">
                    <HiOutlineSelector className="text-lg" />
                  </span>
                  <div
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0 border border-black/10"
                    style={{ backgroundColor: skill.color || "#1a1a1a" }}
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#1a1a1a] truncate text-sm">{skill.name}</h3>
                    <p className="text-[10px] font-mono text-black/40 mt-0.5">
                      {skill.category} &bull; {skill.percentage !== undefined ? skill.percentage : 80}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(skill)}
                    title="Edit Skill"
                    className="p-2 text-black/40 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition duration-200"
                  >
                    <HiOutlinePencil className="text-lg" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill._id)}
                    title="Delete Skill"
                    className="p-2 text-black/40 hover:text-red-600 rounded-xl hover:bg-red-50 transition duration-200"
                  >
                    <HiOutlineTrash className="text-lg" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-black/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">
              {editingSkill ? "Edit Skill" : "Add New Skill"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/60 mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Next.js"
                  className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/60 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                >
                  <option value="Frontend" className="bg-white text-black">Frontend</option>
                  <option value="Backend" className="bg-white text-black">Backend</option>
                  <option value="Tools" className="bg-white text-black">Tools</option>
                  <option value="Design" className="bg-white text-black">Design</option>
                  <option value="UI Library" className="bg-white text-black">UI Library</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/60 mb-2">
                  Icon Identifier (React Icons className string name)
                </label>
                <input
                  type="text"
                  required
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="e.g. SiNextdotjs, FaReact"
                  className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/60 mb-2">
                  Theme HEX Color (used for circles/glows)
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-12 h-11 bg-transparent border-0 cursor-pointer rounded-xl flex-shrink-0"
                  />
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="#ffffff"
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/60 mb-2">
                  Skill Level Percentage (0 - 100)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    name="percentage"
                    value={formData.percentage}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#ff5f1a]"
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    name="percentage"
                    value={formData.percentage}
                    onChange={handleInputChange}
                    placeholder="80"
                    className="w-20 rounded-2xl border border-black/10 bg-black/3 px-3 py-2 text-center text-sm text-[#1a1a1a] transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                  />
                  <span className="text-black/60 font-mono text-sm">%</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-2xl border border-black/10 hover:bg-black/5 text-sm font-semibold text-black/70 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#ff5f1a] hover:bg-[#e04d0d] text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-50"
                >
                  {saving ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Save Skill"
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
