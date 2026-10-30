import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Edit3, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { placementDriveService, placementCellService } from '../../services/api';

export const DrivesManagement = () => {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    companyId: '',
    driveDate: new Date().toISOString().split('T')[0],
    venue: 'Main Campus Auditorium & Labs',
    description: '',
    eligibilityCriteria: 'Minimum 7.0 CGPA, Zero active backlogs',
    status: 'UPCOMING'
  });

  const loadDrives = async () => {
    try {
      const [drivesRes, compsRes] = await Promise.all([
        placementDriveService.getAll(),
        placementCellService.getCompanies(true),
      ]);
      if (drivesRes.success) setDrives(drivesRes.data || []);
      if (compsRes.success) {
        setCompanies(compsRes.data || []);
        if (compsRes.data?.length > 0) {
          setForm((prev) => ({ ...prev, companyId: compsRes.data[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrives();
  }, []);

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    if (!form.companyId || !form.title) return;
    try {
      await placementDriveService.create(form.companyId, form);
      setShowModal(false);
      loadDrives();
    } catch (e) {
      alert('Failed to schedule drive: ' + e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Cancel/Delete this placement drive?')) return;
    try {
      await placementDriveService.delete(id);
      loadDrives();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Campus Placement Drives</h1>
          <p className="text-xs text-slate-500">Schedule and administer on-campus and virtual recruitment sessions</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" /> Schedule New Drive
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : drives.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No drives scheduled yet. Click "Schedule New Drive" to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {drives.map((d) => (
            <div
              key={d.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                    {d.company?.companyName}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    {d.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-800">{d.title}</h3>
                <p className="text-xs text-slate-500 max-w-2xl">{d.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                    Date: {d.driveDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {d.venue}
                  </span>
                  <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    Criteria: {d.eligibilityCriteria}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDelete(d.id)}
                  className="rounded-xl border border-rose-200 p-2 text-rose-600 hover:bg-rose-50 transition"
                  title="Delete Drive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Schedule Placement Drive</h3>
            <form onSubmit={handleCreateDrive} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Recruiting Partner Company</label>
                <select
                  value={form.companyId}
                  onChange={(e) => setForm({ ...form, companyId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-indigo-500 focus:outline-none"
                >
                  {companies.map((c) => (
                    <option key={c.id} value={c.id}>{c.companyName} ({c.industry})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Drive Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  placeholder="e.g. Google India Campus Hiring Drive 2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Drive Date</label>
                  <input
                    type="date"
                    required
                    value={form.driveDate}
                    onChange={(e) => setForm({ ...form, driveDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Venue / Mode</label>
                  <input
                    type="text"
                    required
                    value={form.venue}
                    onChange={(e) => setForm({ ...form, venue: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Eligibility Criteria</label>
                <input
                  type="text"
                  required
                  value={form.eligibilityCriteria}
                  onChange={(e) => setForm({ ...form, eligibilityCriteria: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  placeholder="Outline drive rounds, online test structure, and interview schedules..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white shadow-sm"
                >
                  Schedule Drive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrivesManagement;
