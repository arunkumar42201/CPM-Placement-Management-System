import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Trash2, Calendar, Send } from 'lucide-react';
import { announcementService } from '../../services/api';

export const TeacherAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    targetRole: 'STUDENT',
    category: 'ACADEMIC_NOTICE',
  });

  const loadAnnouncements = async () => {
    try {
      const res = await announcementService.getAll('STUDENT');
      if (res.success && res.data) {
        setAnnouncements(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) return;
    try {
      await announcementService.create(form);
      setShowModal(false);
      setForm({ title: '', content: '', targetRole: 'STUDENT', category: 'ACADEMIC_NOTICE' });
      loadAnnouncements();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await announcementService.delete(id);
      loadAnnouncements();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Faculty Notices & Announcements</h1>
          <p className="text-xs text-slate-500">Post department schedules, assignment notices, and lab guidelines</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" /> Broadcast Notice
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No notices posted yet. Click "Broadcast Notice" to post one.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="flex items-start justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                    {a.category || 'NOTICE'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'Recent'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-800">{a.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{a.content}</p>
              </div>

              <button
                onClick={() => handleDelete(a.id)}
                className="text-slate-400 hover:text-rose-500 p-1 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Broadcast Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800">Broadcast Academic Notice</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700">Notice Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  placeholder="e.g. Mid-term Assignment Submission Window"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Content</label>
                <textarea
                  rows={4}
                  required
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
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
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" /> Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAnnouncements;
