import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';
import { adminService } from '../../services/api';

export const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const loadUsers = async () => {
    try {
      const res = await adminService.getUsers();
      if (res.success && res.data) {
        setUsers(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleActive = async (userId) => {
    try {
      await adminService.toggleUser(userId);
      loadUsers();
    } catch (e) {
      alert('Failed: ' + e.message);
    }
  };

  const filtered = users.filter((u) => {
    const name = u.fullName?.toLowerCase() || '';
    const email = u.email?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    const matchesSearch = name.includes(term) || email.includes(term);
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">User Access & Account Control</h1>
        <p className="text-xs text-slate-500">Manage user authorization, activate/deactivate accounts, and inspect roles</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-semibold text-slate-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="ALL">All Roles</option>
          <option value="STUDENT">Student</option>
          <option value="TEACHER">Faculty</option>
          <option value="PLACEMENT_OFFICER">Placement Officer</option>
          <option value="COMPANY">Recruiter</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No users found.
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Phone</th>
                  <th className="px-6 py-3.5">Assigned Role</th>
                  <th className="px-6 py-3.5">Account Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{u.fullName}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{u.phoneNumber || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700">
                        {u.role?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        u.enabled !== false ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.enabled !== false ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleToggleActive(u.id)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                          u.enabled !== false
                            ? 'border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {u.enabled !== false ? 'Disable' : 'Enable'}
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

export default UserManagement;
