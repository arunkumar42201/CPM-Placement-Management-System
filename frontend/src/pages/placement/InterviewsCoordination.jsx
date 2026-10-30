import React, { useState, useEffect } from 'react';
import { Calendar, Users, Video, ExternalLink, Clock, Building2 } from 'lucide-react';
import { placementCellService } from '../../services/api';

export const InterviewsCoordination = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await placementCellService.getAllInterviews();
        if (res.success && res.data) {
          setInterviews(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Campus Interviews Coordination</h1>
        <p className="text-xs text-slate-500">Central interview schedule across all companies and shortlisted candidates</p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : interviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No interviews scheduled currently.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {interviews.map((inv) => (
            <div key={inv.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600">
                  {inv.application?.job?.company?.companyName || 'Recruiter'}
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  {inv.status || 'SCHEDULED'}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800">{inv.roundName}</h3>
                <p className="text-xs text-slate-600">Candidate: {inv.application?.student?.user?.fullName}</p>
                <p className="text-[11px] text-slate-400">{inv.application?.job?.title}</p>
              </div>

              <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Date: <strong>{inv.interviewDate}</strong></span>
                </div>
                {inv.notes && <p className="text-[11px] text-slate-600 italic">"{inv.notes}"</p>}
              </div>

              {inv.meetingUrl && (
                <a
                  href={inv.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1 rounded-xl bg-indigo-50 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition"
                >
                  <Video className="h-3.5 w-3.5" /> Meeting Link
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewsCoordination;
