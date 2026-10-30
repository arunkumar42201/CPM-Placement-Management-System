import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Plus, Trash2, Edit3, MapPin, Calendar } from 'lucide-react';
import { jobService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const CompanyJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusStyles = {
    PENDING: 'bg-amber-50 text-amber-700',
    ACTIVE: 'bg-emerald-50 text-emerald-700',
    REJECTED: 'bg-rose-50 text-rose-700',
    CLOSED: 'bg-slate-100 text-slate-600',
    DRAFT: 'bg-slate-100 text-slate-600',
  };

  const loadJobs = async () => {
    try {
      const res = user?.profileId
        ? await jobService.getCompanyJobs(user.profileId)
        : await jobService.getAll();
      if (res.success && res.data) {
        setJobs(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this job opening?')) return;
    try {
      await jobService.delete(id);
      loadJobs();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Manage Job Openings</h1>
          <p className="text-xs text-slate-500">Track and update posted jobs and hiring criteria</p>
        </div>

        <Link
          to="/company/jobs/new"
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" /> Post New Job
        </Link>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No job openings posted yet. Click "+ Post New Job" to begin hiring.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((j) => (
            <div
              key={j.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="rounded-lg bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                    {j.jobType?.replace('_', ' ')}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusStyles[j.status] || 'bg-slate-100 text-slate-700'}`}>
                    {j.status || 'ACTIVE'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-800 mt-2">{j.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{j.description}</p>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                  <span className="font-bold text-indigo-600">₹{j.ctcLpa} LPA</span>
                  <span>•</span>
                  <span>{j.location}</span>
                  <span>•</span>
                  <span>Min {j.minCgpa} CGPA</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Deadline: {j.deadline || 'Rolling'}</span>
                <button
                  onClick={() => handleDelete(j.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                  title="Delete Job"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyJobs;
