import React, { useState, useEffect } from 'react';
import { Building2, Search, CheckCircle2, Globe, Mail } from 'lucide-react';
import { placementCellService } from '../../services/api';

export const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadCompanies = async () => {
    try {
      const res = await placementCellService.getCompanies();
      if (res.success && res.data) {
        setCompanies(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleApprove = async (companyId, approve) => {
    try {
      await placementCellService.approveCompany(companyId, approve);
      loadCompanies();
    } catch (e) {
      alert(e.message);
    }
  };

  const filtered = companies.filter((c) =>
    c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Recruiting Partners Master Catalog</h1>
        <p className="text-xs text-slate-500">Oversee corporate recruiter accounts, active listings, and institutional approval status</p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search partner companies..."
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
          No companies found.
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Company Name</th>
                  <th className="px-6 py-3.5">Industry</th>
                  <th className="px-6 py-3.5">Website</th>
                  <th className="px-6 py-3.5">Approval Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4 font-bold text-slate-800">{c.companyName}</td>
                    <td className="px-6 py-4 text-slate-500">{c.industry}</td>
                    <td className="px-6 py-4 text-indigo-600 truncate max-w-xs">{c.website || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        c.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleApprove(c.id, !c.isApproved)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                          c.isApproved
                            ? 'border border-rose-200 text-rose-700 hover:bg-rose-50'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {c.isApproved ? 'Revoke' : 'Approve'}
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

export default AdminCompanies;
