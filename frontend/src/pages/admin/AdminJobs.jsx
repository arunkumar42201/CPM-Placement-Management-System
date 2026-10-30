import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseBusiness, Building2, Check, RotateCcw, Search, Trash2, X } from 'lucide-react';
import { jobService } from '../../services/api';

const statusStyles = {
  PENDING: 'bg-amber-100 text-amber-800',
  ACTIVE: 'bg-emerald-100 text-emerald-800',
  REJECTED: 'bg-rose-100 text-rose-800',
  CLOSED: 'bg-slate-200 text-slate-700',
  DRAFT: 'bg-slate-100 text-slate-600',
};

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await jobService.getAll();
      setJobs(response.data || []);
    } catch (loadError) {
      setError(loadError.message || 'Unable to load job postings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDecision = async (jobId, approve) => {
    setUpdatingId(jobId);
    setError('');
    try {
      await jobService.approve(jobId, approve);
      await loadJobs();
    } catch (updateError) {
      setError(updateError.message || 'Unable to update job status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Delete this job posting? This action cannot be undone.')) return;
    setUpdatingId(jobId);
    setError('');
    try {
      await jobService.delete(jobId);
      await loadJobs();
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete job posting');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [job.title, job.company?.companyName, job.location, job.jobType]
      .some((value) => value?.toLowerCase().includes(query));
  });

  const pendingCount = jobs.filter((job) => job.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Job Approvals</h1>
          <p className="mt-1 text-xs text-slate-500">Review recruiter postings before they appear in student jobs.</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800">
          {pendingCount} pending approval
        </div>
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">{error}</div>}

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <Search className="ml-2 h-4 w-4 text-slate-400" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search job or company..." className="w-full bg-transparent text-xs text-slate-800 outline-none" />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" /></div>
      ) : filteredJobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">No job postings found.</div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
                <tr><th className="px-5 py-3.5">Job</th><th className="px-5 py-3.5">Company</th><th className="px-5 py-3.5">Location</th><th className="px-5 py-3.5">Status</th><th className="px-5 py-3.5 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="text-slate-700">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"><BriefcaseBusiness className="h-4 w-4" /></div><div><div className="font-bold text-slate-800">{job.title}</div><div className="mt-0.5 text-[10px] text-slate-400">{job.jobType || 'Job'} • CTC {job.ctcLpa ?? 'N/A'} LPA</div></div></div></td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5 text-slate-400" />{job.company?.companyName || 'N/A'}</div>
                        {job.company?.isApproved !== true && (
                          <Link to="/admin/companies" className="text-[10px] font-bold text-amber-700 underline decoration-amber-300 underline-offset-2 hover:text-amber-900">
                            Company pending approval — review company
                          </Link>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">{job.location || 'N/A'}</td>
                    <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyles[job.status] || 'bg-slate-100 text-slate-700'}`}>{job.status}</span></td>
                    <td className="px-5 py-4 text-right">
                      {job.status === 'PENDING' ? (
                        <div className="flex justify-end gap-2">
                          <button disabled={updatingId === job.id || job.company?.isApproved !== true} title={job.company?.isApproved === true ? 'Approve job' : 'Approve the company profile first'} onClick={() => handleDecision(job.id, true)} className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"><Check className="h-3.5 w-3.5" />Approve</button>
                          <button disabled={updatingId === job.id} onClick={() => handleDecision(job.id, false)} className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-3 py-2 font-bold text-rose-700 hover:bg-rose-50 disabled:opacity-50"><X className="h-3.5 w-3.5" />Reject</button>
                          <button disabled={updatingId === job.id} onClick={() => handleDelete(job.id)} aria-label={`Delete ${job.title}`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" />Delete</button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button disabled={updatingId === job.id || job.company?.isApproved !== true} title={job.company?.isApproved === true ? 'Activate job' : 'Approve the company profile first'} onClick={() => handleDecision(job.id, true)} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"><RotateCcw className="h-3.5 w-3.5" />Activate</button>
                          <button disabled={updatingId === job.id} onClick={() => handleDelete(job.id)} aria-label={`Delete ${job.title}`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" />Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
