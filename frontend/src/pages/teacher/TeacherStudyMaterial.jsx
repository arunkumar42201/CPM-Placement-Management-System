import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, FileText, Download, Trash2, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { teacherService } from '../../services/api';

export const TeacherStudyMaterial = () => {
  const { user } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', course: 'Operating Systems & Cloud', fileUrl: '' });

  const loadMaterials = async () => {
    if (!user?.id) return;
    try {
      const tRes = await teacherService.getByUserId(user.id);
      if (tRes.success && tRes.data) {
        setTeacher(tRes.data);
      }
      const res = await teacherService.getAllStudyMaterials();
      if (res.success && res.data) {
        setMaterials(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, [user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!teacher?.id || !form.title) return;
    try {
      await teacherService.uploadStudyMaterial(teacher.id, form);
      setShowModal(false);
      setForm({ title: '', course: 'Operating Systems & Cloud', fileUrl: '' });
      loadMaterials();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Study Materials & Notes Repository</h1>
          <p className="text-xs text-slate-500">Curate academic resources, lecture presentations, and technical documentation</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" /> Upload Material
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : materials.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No study materials shared yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {materials.map((m) => (
            <div
              key={m.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
            >
              <div>
                <div className="flex items-center gap-2 text-indigo-600">
                  <FileText className="h-5 w-5" />
                  <span className="text-xs font-bold">{m.course || 'Course Material'}</span>
                </div>
                <h3 className="text-base font-bold text-slate-800 mt-2">{m.title}</h3>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">PDF / Document</span>
                {m.fileUrl ? (
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    <Download className="h-3.5 w-3.5" /> Access File
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Uploaded to Campus Library</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800">Share Study Material</h3>
            <form onSubmit={handleUpload} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700">Material Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  placeholder="e.g. Distributed Database Systems Lecture Slides"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Course / Subject</label>
                <input
                  type="text"
                  required
                  value={form.course}
                  onChange={(e) => setForm({ ...form, course: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Document URL / Drive Link</label>
                <input
                  type="url"
                  value={form.fileUrl}
                  onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  placeholder="https://drive.google.com/..."
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
                  Upload & Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherStudyMaterial;
