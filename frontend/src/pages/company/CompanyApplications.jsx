import React, { useState, useEffect } from 'react';
import { FileCheck, Search, Filter, Calendar, MessageSquare, ExternalLink, Video } from 'lucide-react';
import { applicationService } from '../../services/api';

export const CompanyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: 'SHORTLISTED', feedback: '' });
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    roundName: 'Round 1 - Technical Coding',
    scheduledAt: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16),
    meetingLink: 'https://meet.google.com/company-interview',
    feedback: 'Please be prepared to share your screen and code solutions in Java/C++.'
  });

  const loadApps = async () => {
    try {
      setLoading(true);
      const res = await applicationService.getMyCompanyApplications();
      const payload = Array.isArray(res) ? res : res?.data ?? [];
      setApplications(payload);
    } catch (e) {
      console.error(e);
      setApplications([]);
      setError(e.message || 'Unable to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, []);

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp?.id) return;
    try {
      await applicationService.updateStatus(selectedApp.id, statusForm.status, statusForm.feedback);
      setShowStatusModal(false);
      loadApps();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!selectedApp?.id) return;
    try {
      await applicationService.scheduleInterview(selectedApp.id, interviewForm);
      setShowInterviewModal(false);
      loadApps();
    } catch (e) {
      alert(e.message);
    }
  };

  const filtered = applications.filter((a) => {
    const studentName = (a.studentName || a.student?.user?.fullName || '').toLowerCase();
    const jobTitle = (a.jobTitle || a.job?.title || '').toLowerCase();
    const candidateEmail = (a.email || a.student?.user?.email || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return studentName.includes(query) || jobTitle.includes(query) || candidateEmail.includes(query);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Review Candidate Applications</h1>
        <p className="text-xs text-slate-500">Inspect student profiles, update hiring pipeline stage, and schedule interviews</p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search by student name or job opening..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center text-xs text-rose-700">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No candidate applications found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-800">{app.studentName || app.student?.user?.fullName}</h3>
                  <p className="text-xs text-slate-500">
                    Applied for <strong>{app.jobTitle || app.job?.title}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                    {app.status?.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      CGPA: {app.cgpa ?? 'N/A'}
                  </span>
                </div>
              </div>

              {app.coverNote && (
                <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Cover Note: </span>
                  {app.coverNote}
                </div>
              )}

              <div className="grid gap-2 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 text-xs text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
                <div><span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Email</span><span className="font-semibold text-slate-800">{app.email || app.student?.user?.email || 'Not provided'}</span></div>
                <div><span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Applied</span><span className="font-semibold text-slate-800">{app.appliedAt ? new Date(app.appliedAt).toLocaleString() : 'Recently'}</span></div>
                <div><span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Job ID</span><span className="font-semibold text-slate-800">{app.jobId || app.job?.id || 'N/A'}</span></div>
                <div><span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Phone</span><span className="font-semibold text-slate-800">{app.phone || 'Not provided'}</span></div>
                <div><span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Resume</span>{app.resumeUrl ? <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="font-bold text-indigo-600 hover:text-indigo-800">View resume <ExternalLink className="inline h-3 w-3" /></a> : <span className="font-semibold text-slate-500">Not uploaded</span>}</div>
              </div>

              {/* Skills of candidate */}
              <div className="flex flex-wrap gap-1">
                {app.skills?.map((skill) => (
                  <span key={skill} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                    {skill}
                  </span>
                ))}
              </div>
              {app.internships?.length > 0 && (
                <p className="text-xs text-slate-600">Experience: {app.internships.join(', ')}</p>
              )}

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-400 text-[11px]">Applied on {app.appliedAt ? new Date(app.appliedAt).toLocaleString() : 'Recently'}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedApp(app);
                      setStatusForm({ status: app.status || 'SHORTLISTED', feedback: app.recruiterFeedback || app.feedback || '' });
                      setShowStatusModal(true);
                    }}
                    className="rounded-xl border border-slate-200 px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50"
                  >
                    Update Stage
                  </button>
                  <button
                    onClick={() => {
                      setSelectedApp(app);
                      setShowInterviewModal(true);
                    }}
                    className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3.5 py-1.5 font-bold text-white hover:bg-indigo-700 shadow-sm"
                  >
                    <Calendar className="h-3.5 w-3.5" /> Schedule Round
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stage Update Modal */}
      {showStatusModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800">
              Update Candidate Stage: {selectedApp.studentName}
            </h3>
            <form onSubmit={handleUpdateStatus} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700">Status</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                >
                  <option value="SHORTLISTED">Shortlist for Interview</option>
                  <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                  <option value="OFFERED">Extend Job Offer</option>
                  <option value="REJECTED">Reject</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Recruiter Feedback Note</label>
                <textarea
                  rows={3}
                  value={statusForm.feedback}
                  onChange={(e) => setStatusForm({ ...statusForm, feedback: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  placeholder="Notes shared with candidate or placement cell..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white"
                >
                  Save Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showInterviewModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800">
              Schedule Interview: {selectedApp.studentName}
            </h3>
            <form onSubmit={handleScheduleInterview} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700">Round Title</label>
                <input
                  type="text"
                  required
                  value={interviewForm.roundName}
                  onChange={(e) => setInterviewForm({ ...interviewForm, roundName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Date</label>
                <input
                  type="datetime-local"
                  required
                  value={interviewForm.scheduledAt}
                  onChange={(e) => setInterviewForm({ ...interviewForm, scheduledAt: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Meeting URL</label>
                <input
                  type="url"
                  value={interviewForm.meetingLink}
                  onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Interview Instructions</label>
                <textarea
                  rows={2}
                  value={interviewForm.feedback}
                  onChange={(e) => setInterviewForm({ ...interviewForm, feedback: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInterviewModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white shadow-sm"
                >
                  Confirm Round
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyApplications;
