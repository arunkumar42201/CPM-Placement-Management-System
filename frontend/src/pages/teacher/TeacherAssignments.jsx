import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, FileText, CheckCircle2, Clock, Award, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { teacherService, adminService } from '../../services/api';

export const TeacherAssignments = () => {
  const { user } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    courseId: '',
    maxMarks: 100,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Submissions & Grading Modal
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeForm, setGradeForm] = useState({ marks: '', feedback: '' });

  const loadAssignments = async () => {
    if (!user?.id) return;
    try {
      const tRes = await teacherService.getByUserId(user.id);
      if (tRes.success && tRes.data) {
        const t = tRes.data;
        setTeacher(t);

        const [aRes, cRes] = await Promise.all([
          teacherService.getTeacherAssignments(t.id),
          adminService.getCourses().catch(() => ({ data: [] })),
        ]);

        if (aRes.success) setAssignments(aRes.data || []);
        if (cRes.data) {
          setCourses(cRes.data);
          if (cRes.data.length > 0) setForm(prev => ({ ...prev, courseId: cRes.data[0].id }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!teacher?.id) return;
    try {
      await teacherService.createAssignment(teacher.id, form);
      setShowCreateModal(false);
      loadAssignments();
    } catch (e) {
      alert('Failed: ' + e.message);
    }
  };

  const handleViewSubmissions = async (asgn) => {
    setSelectedAssignment(asgn);
    try {
      const res = await teacherService.getAssignmentSubmissions(asgn.id);
      if (res.success) setSubmissions(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const handleGrade = async (e) => {
    e.preventDefault();
    if (!gradingSubmission?.id) return;
    try {
      await teacherService.gradeSubmission(gradingSubmission.id, Number(gradeForm.marks), gradeForm.feedback);
      setGradingSubmission(null);
      if (selectedAssignment) handleViewSubmissions(selectedAssignment);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Coursework & Assignments</h1>
          <p className="text-xs text-slate-500">Design academic assignments, review student submissions, and award grades</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" /> Create Assignment
        </button>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : assignments.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No assignments published yet. Click "Create Assignment" to post one for your class.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assignments.map((asgn) => (
            <div
              key={asgn.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="rounded-lg bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                    Max Marks: {asgn.maxMarks}
                  </span>
                  <span className="text-[11px] text-slate-400">Due: {asgn.dueDate}</span>
                </div>

                <h3 className="text-base font-bold text-slate-800 mt-2">{asgn.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{asgn.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Course Work</span>
                <button
                  onClick={() => handleViewSubmissions(asgn)}
                  className="rounded-xl bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                >
                  Review Submissions
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submissions Review Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Submissions: {selectedAssignment.title}
                </h3>
                <p className="text-xs text-slate-500">Max Marks: {selectedAssignment.maxMarks}</p>
              </div>
              <button
                onClick={() => setSelectedAssignment(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {submissions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No submissions received yet.</div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div key={sub.id} className="rounded-2xl border border-slate-200 p-4 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-800">
                        {sub.student?.user?.fullName} ({sub.student?.rollNumber})
                      </div>
                      <div>
                        {sub.marksObtained !== null ? (
                          <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-bold text-emerald-800">
                            Score: {sub.marksObtained} / {selectedAssignment.maxMarks}
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 font-bold text-amber-800">
                            Pending Evaluation
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl">{sub.submissionText}</p>

                    {sub.fileUrl && (
                      <a href={sub.fileUrl} target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold flex items-center gap-1">
                        <ExternalLink className="h-3.5 w-3.5" /> Project Repository / Artifact Link
                      </a>
                    )}

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setGradingSubmission(sub);
                          setGradeForm({ marks: sub.marksObtained || '', feedback: sub.feedback || '' });
                        }}
                        className="rounded-xl bg-indigo-600 px-3 py-1.5 font-bold text-white hover:bg-indigo-700"
                      >
                        {sub.marksObtained !== null ? 'Re-Grade' : 'Award Marks'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grading Dialog */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800">
              Grade: {gradingSubmission.student?.user?.fullName}
            </h3>
            <form onSubmit={handleGrade} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700">Marks Awarded (Max {selectedAssignment?.maxMarks})</label>
                <input
                  type="number"
                  required
                  min="0"
                  max={selectedAssignment?.maxMarks}
                  value={gradeForm.marks}
                  onChange={(e) => setGradeForm({ ...gradeForm, marks: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Feedback / Evaluation Comments</label>
                <textarea
                  rows={3}
                  value={gradeForm.feedback}
                  onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  placeholder="Constructive feedback..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white shadow-sm"
                >
                  Submit Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800">Create New Assignment</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700">Course</label>
                <select
                  value={form.courseId}
                  onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.code} — {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  placeholder="e.g. Distributed Consensus Implementation"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Max Marks</label>
                  <input
                    type="number"
                    required
                    value={form.maxMarks}
                    onChange={(e) => setForm({ ...form, maxMarks: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Due Date</label>
                  <input
                    type="date"
                    required
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Problem Statement & Instructions</label>
                <textarea
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white shadow-sm"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherAssignments;
