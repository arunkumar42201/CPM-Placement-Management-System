import React, { useState, useEffect } from 'react';
import { Megaphone, Calendar, Tag, AlertCircle, Bell } from 'lucide-react';
import { announcementService } from '../../services/api';

export const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
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
    fetchAnnouncements();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Campus & Placement Notices</h1>
        <p className="text-xs text-slate-500">Official bulletins from the placement cell and academic faculty</p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No announcements published yet.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2 hover:border-indigo-200 transition"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                  {item.category || 'CAMPUS_ANNOUNCEMENT'}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-800">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentAnnouncements;
