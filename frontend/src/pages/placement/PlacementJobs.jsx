import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Filter, Trash2, Building2, MapPin } from 'lucide-react';
import { jobService } from '../../services/api';

export const PlacementJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const statusStyles = {
    PENDING: 'bg-amber-50 text-amber-700',
    ACTIVE: 'bg-emerald-50 text-emerald-700',
    REJECTED: 'bg-rose-50 text-rose-700',
    CLOSED: 'bg-slate-100 text-slate-600',
    DRAFT: 'bg-slate-100 text-slate-600',
  };

  const loadJobs = async () => {
    try {
      const res = await jobService.getAll();
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
    if (!confirm('Remove this job opening?')) return;
    try {
      await jobService.delete(id);
      loadJobs();
    } catch (e) {
      alert(e.message);
    }
  };

  const filtered = jobs.filter((j) =>
    j.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Campus Jobs Master Catalog</h1>
        <p className="text-xs text-slate-500">Monitor all posted opportunities and applicant volumes</p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search by job title or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No job postings found.
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Job Title</th>
                  <th className="px-6 py-3.5">Company</th>
                  <th className="px-6 py-3.5">Package</th>
                  <th className="px-6 py-3.5">Type</th>
                  <th className="px-6 py-3.5">Min CGPA</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{j.title}</td>
                    <td className="px-6 py-4">{j.company?.companyName}</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">₹{j.ctcLpa} LPA</td>
                    <td className="px-6 py-4">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        {j.jobType?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">{j.minCgpa}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusStyles[j.status] || 'bg-slate-100 text-slate-700'}`}>
                        {j.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(j.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
};

export default PlacementJobs;
