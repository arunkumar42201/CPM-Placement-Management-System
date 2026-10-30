import React, { useState, useEffect } from 'react';
import { Building2, CheckCircle2, XCircle, Globe, Mail, Phone, ShieldCheck, Search } from 'lucide-react';
import { placementCellService } from '../../services/api';

export const CompaniesManagement = () => {
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
      alert('Action failed: ' + e.message);
    }
  };

  const filtered = companies.filter((c) =>
    c.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Partner Companies Management</h1>
        <p className="text-xs text-slate-500">Approve recruiting organizations and manage corporate partnerships</p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search companies by name or industry domain..."
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((comp) => (
            <div
              key={comp.id}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-bold">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{comp.companyName}</h3>
                      <p className="text-[11px] text-slate-500">{comp.industry}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    comp.isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {comp.isApproved ? 'Approved' : 'Pending Approval'}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {comp.description || 'Enterprise recruiting partner.'}
                </p>

                <div className="mt-4 space-y-1.5 text-xs text-slate-500">
                  {comp.website && (
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-slate-400" />
                      <a href={comp.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline truncate">
                        {comp.website}
                      </a>
                    </div>
                  )}
                  {comp.user?.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>{comp.user.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Campus Recruiter</span>
                {comp.isApproved ? (
                  <button
                    onClick={() => handleApprove(comp.id, false)}
                    className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition"
                  >
                    Revoke Access
                  </button>
                ) : (
                  <button
                    onClick={() => handleApprove(comp.id, true)}
                    className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve Partner
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompaniesManagement;
