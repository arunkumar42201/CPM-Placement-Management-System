import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Video, ExternalLink, Award, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { applicationService, studentService } from '../../services/api';

export const StudentInterviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      if (!user?.id) return;
      try {
        const profRes = await studentService.getByUserId(user.id);
        if (profRes.success && profRes.data) {
          const res = await applicationService.getStudentInterviews(profRes.data.id);
          if (res.success && res.data) {
            setInterviews(res.data);
          }
        }
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
        <h1 className="text-2xl font-extrabold text-slate-800">My Interviews</h1>
        <p className="text-xs text-slate-500">Upcoming technical, behavioral, and HR interview rounds</p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : interviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No interviews scheduled currently. Make sure your profile is updated to get shortlisted!
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {interviews.map((inv) => (
            <div
              key={inv.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                    {inv.application?.job?.company?.companyName || 'Campus Recruiter'}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    {inv.status || 'SCHEDULED'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-800 mt-2">{inv.roundName}</h3>
                <p className="text-xs text-slate-500">{inv.application?.job?.title}</p>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    <span>Date: <strong className="text-slate-800">{inv.interviewDate}</strong></span>
                  </div>
                  {inv.notes && (
                    <div className="rounded-xl bg-slate-50 p-2.5 text-[11px] text-slate-600">
                      {inv.notes}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Online Round</span>
                {inv.meetingUrl ? (
                  <a
                    href={inv.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-sm"
                  >
                    <Video className="h-3.5 w-3.5" />
                    Join Video Call
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Meeting Link Pending</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentInterviews;
