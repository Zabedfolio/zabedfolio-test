"use client";

import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSelector,
} from "react-icons/hi";

export default function AdminExperience() {
  const [exp, setExp] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    institution: "",
    company: "",
    location: "",
    detail: "",
    active: true,
  });

  // Drag State
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    fetchExp();
  }, []);

  const fetchExp = async () => {
    try {
      const res = await fetch("/api/admin/experience");
      const data = await res.json();
      if (Array.isArray(data)) {
        setExp(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingExp(null);
    setFormData({
      startDate: "",
      endDate: "",
      institution: "",
      company: "",
      location: "",
      detail: "",
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingExp(item);
    
    let start = item.startDate || "";
    let end = item.endDate || "";
    if (!start && !end && item.date) {
      const parts = item.date.split("—").map((p) => p.trim());
      if (parts.length === 2) {
        start = parts[0];
        end = parts[1];
      } else {
        start = item.date;
      }
    }

    setFormData({
      startDate: start,
      endDate: end,
      institution: item.institution || "",
      company: item.company || "",
      location: item.location || "",
      detail: item.detail || "",
      active: item.active !== false,
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const submissionData = {
      ...formData,
      date: `${formData.startDate} — ${formData.endDate}`
    };

    try {
      let res;
      if (editingExp) {
        res = await fetch(`/api/admin/experience/${editingExp._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        });
      } else {
        res = await fetch("/api/admin/experience", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submissionData),
        });
      }

      if (res.ok) {
        fetchExp();
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this experience entry?")) return;

    try {
      const res = await fetch(`/api/admin/experience/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setExp((prev) => prev.filter((item) => item._id !== id));
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

    const list = [...exp];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setExp(list);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const reorderedList = exp.map((item, idx) => ({
      id: item._id,
      order: idx,
    }));

    try {
      await fetch("/api/admin/experience/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reorderedList),
      });
    } catch (err) {
      console.error("Failed saving experience order:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">Timeline: Experience</h1>
          <p className="mt-2 text-sm text-black/50">Rearrange timeline order of professional work experience</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#ff5f1a] hover:bg-[#e04d0d] text-sm font-semibold text-white transition active:scale-[0.98] shadow-sm self-start sm:self-auto"
        >
          <HiOutlinePlus className="text-lg" /> Add Experience
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-white border border-black/8 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="border border-black/8 bg-white rounded-2xl overflow-hidden shadow-sm">
          {exp.length === 0 ? (
            <div className="p-12 text-center text-black/40 text-sm">
              No experience records found. Click "Add Experience" to create one.
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {exp.map((item, idx) => (
                <div
                  key={item._id}
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center justify-between p-4 sm:p-5 transition hover:bg-black/2 ${
                    draggedIndex === idx ? "opacity-35 bg-black/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="cursor-grab text-black/30 hover:text-[#ff5f1a] p-1 transition active:cursor-grabbing">
                      <HiOutlineSelector className="text-lg" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-[#1a1a1a] truncate text-sm">
                          {item.institution} {item.company ? `@ ${item.company}` : ""}
                        </h3>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                            item.active
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-black/5 text-black/40 border-black/10"
                          }`}
                        >
                          {item.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-black/50 mt-1 truncate">
                        {item.startDate && item.endDate ? `${item.startDate} — ${item.endDate}` : item.date}
                        {item.location ? ` • ${item.location}` : ""} &bull; {item.detail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-2 text-black/40 hover:text-blue-600 rounded-xl hover:bg-blue-50 transition duration-200"
                    >
                      <HiOutlinePencil className="text-lg" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-black/40 hover:text-red-600 rounded-xl hover:bg-red-50 transition duration-200"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white border border-black/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">
              {editingExp ? "Edit Experience Entry" : "Add Experience Entry"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/60 mb-2">
                  Role Title / Designation
                </label>
                <input
                  type="text"
                  required
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="e.g. Frontend Developer"
                  className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/60 mb-2">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g. Google"
                  className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-black/60 mb-2">
                    Start Date / Year
                  </label>
                  <input
                    type="text"
                    required
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    placeholder="e.g. 2023"
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-black/60 mb-2">
                    End Date / Present
                  </label>
                  <input
                    type="text"
                    required
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    placeholder="e.g. Present"
                    className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/60 mb-2">
                  Job Location Type
                </label>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                >
                  <option value="" className="bg-white text-black">Select location type...</option>
                  <option value="On-site" className="bg-white text-black">On-site</option>
                  <option value="Remote" className="bg-white text-black">Remote</option>
                  <option value="Hybrid" className="bg-white text-black">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/60 mb-2">
                  Role Detail / Description Context
                </label>
                <textarea
                  required
                  name="detail"
                  rows={3}
                  value={formData.detail}
                  onChange={handleInputChange}
                  placeholder="e.g. Built responsive dashboards, polished marketing surfaces..."
                  className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="h-4.5 w-4.5 rounded border-black/20 accent-[#ff5f1a] cursor-pointer"
                />
                <label htmlFor="active" className="text-sm font-semibold text-[#1a1a1a] cursor-pointer">
                  Active (show this entry in the timeline)
                </label>
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
                    "Save Entry"
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
