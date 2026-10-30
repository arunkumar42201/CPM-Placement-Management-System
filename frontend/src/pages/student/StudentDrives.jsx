import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Building2, MapPin, Clock, CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';
import { placementDriveService } from '../../services/api';

export const StudentDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const res = await placementDriveService.getAll();
        if (res.success && res.data) {
          setDrives(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Campus Placement Drives</h1>
        <p className="text-xs text-slate-500">Scheduled recruitment drives and hiring sessions on campus</p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : drives.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No campus drives scheduled at the moment.
        </div>
      ) : (
        <div className="space-y-4">
          {drives.map((drive) => (
            <div
              key={drive.id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-300 transition"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                    {drive.company?.companyName || 'Corporate Partner'}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    {drive.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-800">{drive.title}</h3>
                <p className="text-xs text-slate-500 max-w-2xl">{drive.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                    Drive Date: {drive.driveDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {drive.venue || 'Campus Auditorium & Virtual Labs'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to="/student/jobs"
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                >
                  <Briefcase className="h-3.5 w-3.5" />
                  View Drive Jobs
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDrives;
