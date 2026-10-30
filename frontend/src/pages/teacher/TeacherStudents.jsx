import React, { useState, useEffect } from 'react';
import { Users, Search, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { teacherService } from '../../services/api';

export const TeacherStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.id) return;
      try {
        const tRes = await teacherService.getByUserId(user.id);
        if (tRes.success && tRes.data) {
          const res = await teacherService.getDepartmentStudents(tRes.data.department?.id || 1);
          if (res.success && res.data) {
            setStudents(res.data);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [user]);

  const filtered = students.filter((s) =>
    s.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Department Students Directory</h1>
        <p className="text-xs text-slate-500">Student academic standing, roll numbers, and contact details</p>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <Search className="h-4 w-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search students by name or roll number..."
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
          No students found.
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5">Roll Number</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">CGPA</th>
                  <th className="px-6 py-3.5">Placement Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{s.user?.fullName}</div>
                      <div className="text-[11px] text-slate-400">{s.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-600">{s.rollNumber}</td>
                    <td className="px-6 py-4">{s.department?.name}</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">{s.cgpa}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                        {s.placementStatus || 'ELIGIBLE'}
                      </span>
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

export default TeacherStudents;
