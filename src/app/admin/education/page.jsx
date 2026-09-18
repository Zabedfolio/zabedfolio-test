"use client";

import { useEffect, useState } from "react";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSelector,
} from "react-icons/hi";

export default function AdminEducation() {
  const [edu, setEdu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    date: "",
    institution: "",
    detail: "",
    active: true,
  });

  // Drag State
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    fetchEdu();
  }, []);

  const fetchEdu = async () => {
    try {
      const res = await fetch("/api/admin/education");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEdu(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingEdu(null);
    setFormData({
      date: "",
      institution: "",
      detail: "",
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingEdu(item);
    setFormData({
      date: item.date || "",
      institution: item.institution || "",
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

    try {
      let res;
      if (editingEdu) {
        res = await fetch(`/api/admin/education/${editingEdu._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch("/api/admin/education", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      if (res.ok) {
        fetchEdu();
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;

    try {
      const res = await fetch(`/api/admin/education/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEdu((prev) => prev.filter((item) => item._id !== id));
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

    const list = [...edu];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setEdu(list);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const reorderedList = edu.map((item, idx) => ({
      id: item._id,
      order: idx,
    }));

    try {
      await fetch("/api/admin/education/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reorderedList),
      });
    } catch (err) {
      console.error("Failed saving education order:", err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">Timeline: Education</h1>
          <p className="mt-2 text-sm text-black/50">Rearrange timeline order of your academic credentials</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#ff5f1a] hover:bg-[#e04d0d] text-sm font-semibold text-white transition active:scale-[0.98] shadow-sm self-start sm:self-auto"
        >
          <HiOutlinePlus className="text-lg" /> Add Education
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
          {edu.length === 0 ? (
            <div className="p-12 text-center text-black/40 text-sm">
              No education records found. Click "Add Education" to create one.
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {edu.map((item, idx) => (
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
                          {item.institution}
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
                        {item.date} &bull; {item.detail}
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
              {editingEdu ? "Edit Education Entry" : "Add Education Entry"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/60 mb-2">
                  Degree / Certificate / Course Name
                </label>
                <input
                  type="text"
                  required
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="e.g. BSc in Computer Science"
                  className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/60 mb-2">
                  Duration / Date Range
                </label>
                <input
                  type="text"
                  required
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  placeholder="e.g. 2023 — Present"
                  className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] placeholder-black/30 transition focus:border-[#ff5f1a] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-black/60 mb-2">
                  Institution / Detail Context
                </label>
                <input
                  type="text"
                  required
                  name="detail"
                  value={formData.detail}
                  onChange={handleInputChange}
                  placeholder="e.g. International Islamic University Chittagong"
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
