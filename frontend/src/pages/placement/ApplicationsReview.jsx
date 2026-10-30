import React, { useState, useEffect } from 'react';
import { FileCheck, Search, Filter, CheckCircle2, XCircle, Clock, Calendar, MessageSquare, Video } from 'lucide-react';
import { placementCellService, applicationService } from '../../services/api';

export const ApplicationsReview = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Status Update & Interview Modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [statusForm, setStatusForm] = useState({ status: 'SHORTLISTED', feedback: '' });
  const [showStatusModal, setShowStatusModal] = useState(false);

  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    roundName: 'Technical Round 1',
    interviewDate: new Date().toISOString().split('T')[0],
    meetingUrl: 'https://meet.google.com/abc-defg-hij',
    notes: 'Coding and algorithmic problem solving assessment.'
  });

  const loadApps = async () => {
    try {
      const res = await placementCellService.getAllApplications();
      if (res.success && res.data) {
        setApplications(res.data);
      }
    } catch (e) {
      console.error(e);
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
    const sName = a.student?.user?.fullName?.toLowerCase() || '';
    const jTitle = a.job?.title?.toLowerCase() || '';
    const cName = a.job?.company?.companyName?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return sName.includes(term) || jTitle.includes(term) || cName.includes(term);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Master Applications Review</h1>
        <p className="text-xs text-slate-500">Review student candidacies, shortlist candidates, and schedule recruitment rounds</p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Filter by candidate name, company, or job role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Candidate</th>
                  <th className="px-6 py-3.5">Role / Company</th>
                  <th className="px-6 py-3.5">CGPA</th>
                  <th className="px-6 py-3.5">Applied Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{app.student?.user?.fullName}</div>
                      <div className="text-[11px] text-slate-400">{app.student?.rollNumber} • {app.student?.department?.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{app.job?.title}</div>
                      <div className="text-[11px] text-indigo-600">{app.job?.company?.companyName}</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{app.student?.cgpa}</td>
                    <td className="px-6 py-4 text-slate-500">{app.applicationDate}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                        {app.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setStatusForm({ status: app.status || 'SHORTLISTED', feedback: app.feedback || '' });
                          setShowStatusModal(true);
                        }}
                        className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition"
                      >
                        Status
                      </button>
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setShowInterviewModal(true);
                        }}
                        className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
                      >
                        + Interview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              Update Status: {selectedApp.student?.user?.fullName}
            </h3>
            <form onSubmit={handleUpdateStatus} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Application Status</label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="APPLIED">Applied</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                  <option value="OFFERED">Offer Extended</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Feedback / Evaluation Notes</label>
                <textarea
                  rows={3}
                  value={statusForm.feedback}
                  onChange={(e) => setStatusForm({ ...statusForm, feedback: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  placeholder="Notes visible to student or placement cell..."
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
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white shadow-sm"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {showInterviewModal && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              Schedule Interview for {selectedApp.student?.user?.fullName}
            </h3>
            <form onSubmit={handleScheduleInterview} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Interview Round Name</label>
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
                  type="date"
                  required
                  value={interviewForm.interviewDate}
                  onChange={(e) => setInterviewForm({ ...interviewForm, interviewDate: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Meeting URL</label>
                <input
                  type="url"
                  value={interviewForm.meetingUrl}
                  onChange={(e) => setInterviewForm({ ...interviewForm, meetingUrl: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700">Instructions / Notes</label>
                <textarea
                  rows={2}
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
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
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationsReview;
