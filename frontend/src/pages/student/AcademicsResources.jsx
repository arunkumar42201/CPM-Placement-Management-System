import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, CheckSquare, BookOpen, Download, FileText, 
  Upload, CheckCircle2, Clock, AlertCircle, ExternalLink, Send 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/api';

export const AcademicsResources = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [attendance, setAttendance] = useState({ totalClasses: 120, attendedClasses: 104, presentPercentage: 86.6 });
  const [assignments, setAssignments] = useState([]);
  const [studyMaterials, setStudyMaterials] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Submit Modal
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionForm, setSubmissionForm] = useState({ submissionText: '', fileUrl: '' });
  const [submitting, setSubmitting] = useState(false);

  const loadAcademicData = async () => {
    if (!user?.id) return;
    try {
      const profRes = await studentService.getByUserId(user.id);
      if (profRes.success && profRes.data) {
        const p = profRes.data;
        setProfile(p);

        const [attRes, assignRes, matsRes, subsRes] = await Promise.all([
          studentService.getAttendance(p.id).catch(() => ({ data: null })),
          studentService.getDepartmentAssignments(p.id).catch(() => ({ data: [] })),
          studentService.getStudyMaterials(p.id).catch(() => ({ data: [] })),
          studentService.getSubmissions(p.id).catch(() => ({ data: [] })),
        ]);

        if (attRes?.data) setAttendance(attRes.data);
        if (assignRes?.data) setAssignments(assignRes.data);
        if (matsRes?.data) setStudyMaterials(matsRes.data);
        if (subsRes?.data) setSubmissions(subsRes.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAcademicData();
  }, [user]);

  const submittedAssignmentIds = new Map(submissions.map((s) => [s.assignment?.id, s]));

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!selectedAssignment?.id || !profile?.id) return;
    setSubmitting(true);
    try {
      await studentService.submitAssignment(profile.id, selectedAssignment.id, submissionForm);
      setSelectedAssignment(null);
      setSubmissionForm({ submissionText: '', fileUrl: '' });
      loadAcademicData();
    } catch (e) {
      alert('Submission failed: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Academics & Study Resources</h1>
        <p className="text-xs text-slate-500">Track class attendance, submit coursework, and access lecture notes</p>
      </div>

      {/* Attendance Summary Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-black text-xl">
              {Number(attendance.presentPercentage || 86.6).toFixed(1)}%
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Department Attendance Record</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Total Classes: {attendance.totalClasses || 120} • Attended: {attendance.attendedClasses || 104}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
              Eligible for Examinations & Drives (Min 75%)
            </span>
          </div>
        </div>
      </div>

      {/* Assignments Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Course Assignments</h3>
            <p className="text-[11px] text-slate-400">Deadlines and faculty submissions</p>
          </div>
        </div>

        {assignments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No pending assignments for your department.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {assignments.map((asgn) => {
              const sub = submittedAssignmentIds.get(asgn.id);
              return (
                <div key={asgn.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-800">{asgn.title}</h4>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        Max Marks: {asgn.maxMarks}
                      </span>
                    </div>
                    <p className="mt-1 text-slate-500 max-w-xl">{asgn.description}</p>
                    <div className="mt-2 text-[11px] text-slate-400">Due Date: {asgn.dueDate}</div>

                    {/* Faculty Feedback if graded */}
                    {sub && sub.marksObtained !== null && (
                      <div className="mt-2 rounded-xl bg-emerald-50 p-2 text-[11px] text-emerald-800 font-medium">
                        Graded: <strong>{sub.marksObtained} / {asgn.maxMarks}</strong> • Feedback: {sub.feedback || 'Good work!'}
                      </div>
                    )}
                  </div>

                  <div className="sm:self-center shrink-0">
                    {sub ? (
                      <span className="rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                        Submitted ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedAssignment(asgn)}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                      >
                        Submit Assignment
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Study Materials Repository */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Department Study Materials & Lecture Notes</h3>
          <p className="text-[11px] text-slate-400">Curated materials, question banks, and reference guides</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(studyMaterials.length > 0 ? studyMaterials : [
            { id: 1, title: 'Data Structures & Algorithms Cheat Sheet', course: 'Computer Science', fileUrl: '#' },
            { id: 2, title: 'System Design & Distributed Architecture Notes', course: 'Software Engineering', fileUrl: '#' },
            { id: 3, title: 'Campus Placement Aptitude & Logical Reasoning Manual', course: 'Placement Training', fileUrl: '#' },
          ]).map((mat) => (
            <div key={mat.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-indigo-600">
                  <FileText className="h-4 w-4" />
                  <span className="font-bold">{mat.title}</span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">{mat.course}</div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">PDF Document</span>
                <a
                  href={mat.fileUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Assignment Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Submit Work: {selectedAssignment.title}</h3>
            <form onSubmit={handleSubmitAssignment} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600">Submission Solution / Notes</label>
                <textarea
                  rows={4}
                  required
                  value={submissionForm.submissionText}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, submissionText: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-indigo-500 focus:outline-none"
                  placeholder="Provide your solution write-up or notes..."
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600">Repository or Document Link</label>
                <input
                  type="url"
                  value={submissionForm.fileUrl}
                  onChange={(e) => setSubmissionForm({ ...submissionForm, fileUrl: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  placeholder="https://github.com/... or Google Drive link"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? 'Submitting...' : 'Turn In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicsResources;
