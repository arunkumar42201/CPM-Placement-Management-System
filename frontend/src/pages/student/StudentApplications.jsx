import React, { useState, useEffect } from 'react';
import { 
  FileCheck, Clock, CheckCircle2, XCircle, AlertCircle, 
  Calendar, Building2, ExternalLink, MessageSquare 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/api';

export const StudentApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.id) return;
      try {
        const res = await applicationService.getMyApplications();
        if (res.success && res.data) {
          setApplications(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'OFFERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'SHORTLISTED':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'INTERVIEW_SCHEDULED':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">My Job Applications</h1>
        <p className="text-xs text-slate-500">Track application statuses, recruiter feedback, and interview schedules</p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          You haven't applied to any campus job openings yet.
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600">
                      {app.job?.company?.companyName}
                    </span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold ${getStatusBadge(app.status)}`}>
                      {app.status?.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mt-1">{app.job?.title}</h3>
                </div>

                <div className="text-right text-xs text-slate-500">
                  <div>Package: <span className="font-bold text-slate-800">₹{app.job?.ctcLpa} LPA</span></div>
                  <div>Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleString() : 'Recently'}</div>
                </div>
              </div>

              {/* Recruiter Feedback / Notes */}
              {(app.recruiterFeedback || app.feedback) && (
                <div className="flex items-start gap-2 rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
                  <MessageSquare className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800">Recruiter Notes: </span>
                    {app.recruiterFeedback || app.feedback}
                  </div>
                </div>
              )}

              {/* Interviews attached */}
              {app.interviews && app.interviews.length > 0 && (
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-2">
                  <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    Scheduled Interview Round
                  </div>
                  {app.interviews.map((inv) => (
                    <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{inv.roundName}</span> • Date: {inv.interviewDate}
                        {inv.notes && <p className="text-slate-500 text-[11px] mt-0.5">{inv.notes}</p>}
                      </div>
                      {inv.meetingUrl && (
                        <a
                          href={inv.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition self-start sm:self-auto"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Join Interview
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentApplications;
