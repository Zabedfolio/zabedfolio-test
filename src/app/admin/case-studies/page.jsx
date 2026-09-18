"use client";

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSelector } from "react-icons/hi";

const emptyForm = {
  title: "",
  subtitle: "",
  summary: "",
  liveUrl: "",
  heroSubtitle: "",
  category: "Case Study",
  year: new Date().getFullYear().toString(),
  image: "",
  tags: "",
  marketStats: "",
  chartData: "",
  evidenceCards: "",
  sources: "",
  problemCoverageAnalysis: "",
  coverageRows: "",
  backlog: "",
  techStack: "",
  whatILearned: "",
  legalBackdrop: "",
};

export default function AdminCaseStudies() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/admin/case-studies");
      const data = await res.json();
      if (Array.isArray(data)) setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      subtitle: item.subtitle || "",
      summary: item.summary || "",
      liveUrl: item.liveUrl || "",
      heroSubtitle: item.heroSubtitle || "",
      marketStats: item.marketStats ? JSON.stringify(item.marketStats, null, 2) : "",
      chartData: item.chartData ? JSON.stringify(item.chartData, null, 2) : "",
      evidenceCards: item.evidenceCards ? JSON.stringify(item.evidenceCards, null, 2) : "",
      category: item.category || "Case Study",
      year: item.year || "",
      image: item.image || "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "",
      sources: Array.isArray(item.sources) ? item.sources.join(", ") : item.sources || "",
      problemCoverageAnalysis: item.problemCoverageAnalysis ? JSON.stringify(item.problemCoverageAnalysis, null, 2) : "",
      coverageRows: item.coverageRows ? JSON.stringify(item.coverageRows, null, 2) : "",
      backlog: Array.isArray(item.backlog) ? item.backlog.join(", ") : item.backlog || "",
      techStack: item.techStack ? JSON.stringify(item.techStack, null, 2) : "",
      whatILearned: item.whatILearned || "",
      legalBackdrop: Array.isArray(item.legalBackdrop) ? item.legalBackdrop.join(", ") : item.legalBackdrop || "",
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidUrl = (value) => {
    if (!value) return true;
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!isValidUrl(formData.liveUrl)) {
      toast.error("Please enter a valid live URL");
      setSaving(false);
      return;
    }

    // parse JSON inputs and normalize arrays
    let marketStats = [];
    let chartData = {};
    let evidenceCards = [];
    let problemCoverageAnalysis = {};
    let coverageRows = [];
    let techStack = [];

    try {
      marketStats = formData.marketStats ? JSON.parse(formData.marketStats) : [];
    } catch (err) {
      toast.error("Invalid JSON in Market stats");
      setSaving(false);
      return;
    }
    try {
      chartData = formData.chartData ? JSON.parse(formData.chartData) : {};
    } catch (err) {
      toast.error("Invalid JSON in Chart data");
      setSaving(false);
      return;
    }
    try {
      evidenceCards = formData.evidenceCards ? JSON.parse(formData.evidenceCards) : [];
    } catch (err) {
      toast.error("Invalid JSON in Evidence cards");
      setSaving(false);
      return;
    }
    try {
      problemCoverageAnalysis = formData.problemCoverageAnalysis ? JSON.parse(formData.problemCoverageAnalysis) : {};
    } catch (err) {
      toast.error("Invalid JSON in Problem coverage analysis");
      setSaving(false);
      return;
    }
    try {
      coverageRows = formData.coverageRows ? JSON.parse(formData.coverageRows) : [];
    } catch (err) {
      toast.error("Invalid JSON in Coverage rows");
      setSaving(false);
      return;
    }
    try {
      techStack = formData.techStack ? JSON.parse(formData.techStack) : [];
    } catch (err) {
      toast.error("Invalid JSON in Tech stack");
      setSaving(false);
      return;
    }

    const payload = {
      ...formData,
      id: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      marketStats,
      chartData,
      evidenceCards,
      sources: formData.sources
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      problemCoverageAnalysis,
      coverageRows,
      techStack,
      backlog: formData.backlog
        .split(",")
        .map((b) => b.trim())
        .filter(Boolean),
      legalBackdrop: formData.legalBackdrop
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
    };

    try {
      const res = editingItem
        ? await fetch(`/api/admin/case-studies/${editingItem._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/case-studies", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (res.ok) {
        fetchItems();
        setModalOpen(false);
        toast.success(`Case study ${editingItem ? "updated" : "created"} successfully.`);
      } else {
        toast.error("Unable to save case study.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save case study.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this case study?")) return;
    try {
      const res = await fetch(`/api/admin/case-studies/${id}`, { method: "DELETE" });
      if (res.ok) setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragStart = (index) => setDraggedIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const list = [...items];
    const draggedItem = list[draggedIndex];
    list.splice(draggedIndex, 1);
    list.splice(index, 0, draggedItem);
    setDraggedIndex(index);
    setItems(list);
  };

  const handleDragEnd = async () => {
    setDraggedIndex(null);
    const reordered = items.map((item, index) => ({ id: item._id, order: index }));
    try {
      await fetch("/api/admin/case-studies/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reordered),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">Case Studies</h1>
          <p className="mt-2 text-sm text-black/50">Manage portfolio case studies and their public detail pages.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 rounded-2xl bg-[#ff5f1a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e04d0d] shadow-sm"
        >
          <HiOutlinePlus className="text-lg" /> Add Case Study
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white border border-black/8 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm">
          {items.length === 0 ? (
            <div className="p-12 text-center text-sm text-black/40">No case studies yet.</div>
          ) : (
            <div className="divide-y divide-black/5">
              {items.map((item, index) => (
                <div
                  key={item._id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className="flex items-center justify-between p-4 sm:p-5 transition hover:bg-black/2"
                >
                  <div className="flex items-center gap-4">
                    <span className="cursor-grab p-1 text-black/30 hover:text-[#ff5f1a]">
                      <HiOutlineSelector className="text-xl" />
                    </span>
                    <div>
                      <div className="font-semibold text-[#1a1a1a]">{item.title}</div>
                      <div className="mt-1 text-xs text-black/50">{item.subtitle || item.summary}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal(item)} className="rounded-xl p-2 text-black/40 transition hover:bg-blue-50 hover:text-blue-600">
                      <HiOutlinePencil className="text-lg" />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="rounded-xl p-2 text-black/40 transition hover:bg-red-50 hover:text-red-600">
                      <HiOutlineTrash className="text-lg" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm sm:p-6">
          <div className="my-8 w-full max-w-3xl rounded-3xl border border-black/10 bg-white p-6 sm:p-8 shadow-2xl">
            <h2 className="mb-6 text-2xl font-bold text-[#1a1a1a]">{editingItem ? "Edit Case Study" : "Create Case Study"}</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Title</label>
                  <input name="title" value={formData.title} onChange={handleInputChange} required className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Subtitle</label>
                  <input name="subtitle" value={formData.subtitle} onChange={handleInputChange} className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Summary</label>
                <textarea name="summary" rows={3} value={formData.summary} onChange={handleInputChange} required className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Live project URL</label>
                  <input name="liveUrl" value={formData.liveUrl} onChange={handleInputChange} className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Year</label>
                  <input name="year" value={formData.year} onChange={handleInputChange} className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Image URL</label>
                  <input name="image" value={formData.image} onChange={handleInputChange} className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Tags (comma separated)</label>
                  <input name="tags" value={formData.tags} onChange={handleInputChange} className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Hero subtitle</label>
                  <input name="heroSubtitle" value={formData.heroSubtitle} onChange={handleInputChange} className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Sources (comma separated)</label>
                  <input name="sources" value={formData.sources} onChange={handleInputChange} className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Market stats (JSON array)</label>
                <textarea name="marketStats" rows={2} value={formData.marketStats} onChange={handleInputChange} placeholder='[{ "label": "Market value", "value": "$12B+", "detail": "~7.9%" }]' className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Evidence cards (JSON array)</label>
                <textarea name="evidenceCards" rows={2} value={formData.evidenceCards} onChange={handleInputChange} placeholder='[{ "title": "68–80% renters", "description": "..." }]' className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Chart data (JSON object)</label>
                <textarea name="chartData" rows={2} value={formData.chartData} onChange={handleInputChange} placeholder='{"holdings":[{ "city":"Dhaka","holdings":592000 }]}' className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Problem Coverage Analysis (JSON object)</label>
                <textarea name="problemCoverageAnalysis" rows={2} value={formData.problemCoverageAnalysis} onChange={handleInputChange} placeholder='{"heading": "Problem Coverage Analysis", "intro": "..."}' className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Coverage rows (JSON array)</label>
                <textarea name="coverageRows" rows={2} value={formData.coverageRows} onChange={handleInputChange} placeholder='[{"problem":"Unauthorized subletting","city":"Khulna","feature":"Verified registration","status":"Solved","tone":"positive"}]' className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Backlog (comma separated)</label>
                <input name="backlog" value={formData.backlog} onChange={handleInputChange} className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Tech stack (JSON array)</label>
                <textarea name="techStack" rows={2} value={formData.techStack} onChange={handleInputChange} placeholder='[{"name": "Next.js 14", "reason": "Fast, responsive"}]' className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">Legal Backdrop (comma separated)</label>
                <input name="legalBackdrop" value={formData.legalBackdrop} onChange={handleInputChange} className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
              </div>

              <div>
                <label className="mb-2 block text-xs font-mono uppercase tracking-wider text-black/60">What I learned</label>
                <textarea name="whatILearned" rows={2} value={formData.whatILearned} onChange={handleInputChange} className="w-full rounded-2xl border border-black/10 bg-black/3 px-4 py-3 text-sm text-[#1a1a1a] focus:border-[#ff5f1a] focus:bg-white focus:outline-none" />
              </div>

              <div className="flex justify-end gap-3 border-t border-black/10 pt-5">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-2xl border border-black/10 px-5 py-3 text-sm font-semibold text-black/70 transition hover:bg-black/5">Cancel</button>
                <button type="submit" disabled={saving} className="rounded-2xl bg-[#ff5f1a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e04d0d] disabled:opacity-50">
                  {saving ? "Saving..." : "Save Case Study"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" theme="light" toastClassName="toast-theme" />
    </div>
  );
}
