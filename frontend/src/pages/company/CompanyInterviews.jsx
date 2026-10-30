import React, { useState, useEffect } from 'react';
import { Calendar, Users, Video, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/api';

export const CompanyInterviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        if (!user?.profileId) {
          setInterviews([]);
          return;
        }
        const res = await applicationService.getCompanyInterviews(user.profileId);
        const payload = Array.isArray(res) ? res : res?.data ?? [];
        setInterviews(payload);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Recruiter Interview Schedule</h1>
        <p className="text-xs text-slate-500">Upcoming technical assessments and panel interview rounds</p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : interviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No interviews scheduled yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {interviews.map((inv) => (
            <div key={inv.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600">{inv.roundName}</span>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  {inv.status || 'SCHEDULED'}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800">{inv.application?.student?.user?.fullName}</h3>
                <p className="text-xs text-slate-500">{inv.application?.job?.title}</p>
              </div>

              <div className="text-xs text-slate-600 pt-2 border-t border-slate-100 space-y-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Date: <strong>{inv.interviewDate}</strong></span>
                </div>
                {inv.notes && <p className="text-[11px] text-slate-500 italic">"{inv.notes}"</p>}
              </div>

              {inv.meetingUrl && (
                <a
                  href={inv.meetingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-50 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition"
                >
                  <Video className="h-3.5 w-3.5" /> Enter Virtual Meeting Room
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyInterviews;
