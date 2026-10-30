import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Download, GraduationCap, 
  CheckCircle2, AlertCircle, Eye, ExternalLink, Mail, Phone 
} from 'lucide-react';
import { studentService } from '../../services/api';

export const StudentsDirectory = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await studentService.getAll();
        if (res.success && res.data) {
          setStudents(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    const name = s.user?.fullName?.toLowerCase() || '';
    const roll = s.rollNumber?.toLowerCase() || '';
    const dept = s.department?.name?.toLowerCase() || '';
    const matchesSearch = name.includes(term) || roll.includes(term) || dept.includes(term);
    const matchesStatus = statusFilter === 'ALL' || s.placementStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Students Master Directory</h1>
          <p className="text-xs text-slate-500">Comprehensive student catalog, placement eligibility, and skill sets</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by student name, roll number, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="PLACED">Placed</option>
          <option value="ELIGIBLE">Eligible</option>
          <option value="ACTIVELY_SEEKING">Actively Seeking</option>
        </select>
      </div>

      {/* Students Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Student</th>
                  <th className="px-6 py-3.5">Roll No</th>
                  <th className="px-6 py-3.5">Department</th>
                  <th className="px-6 py-3.5">CGPA</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Skills</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{s.user?.fullName}</div>
                      <div className="text-[11px] text-slate-400">{s.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-600">{s.rollNumber}</td>
                    <td className="px-6 py-4">{s.department?.name || 'CSE'}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-indigo-600">{Number(s.cgpa || 8.5).toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        s.placementStatus === 'PLACED' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-50 text-indigo-700'
                      }`}>
                        {s.placementStatus || 'ELIGIBLE'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {s.skills?.slice(0, 3).map((sk) => (
                          <span key={sk.id} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
                            {sk.skill?.name}
                          </span>
                        ))}
                        {s.skills?.length > 3 && (
                          <span className="text-[10px] text-slate-400">+{s.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inspect Student Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">{selectedStudent.user?.fullName}</h3>
                <p className="text-xs text-slate-500">{selectedStudent.rollNumber} • {selectedStudent.department?.name}</p>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">CGPA</span>
                <span className="font-bold text-indigo-600">{selectedStudent.cgpa} / 10.0</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Email</span>
                <span className="font-medium text-slate-700">{selectedStudent.user?.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Phone</span>
                <span className="font-medium text-slate-700">{selectedStudent.user?.phoneNumber || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Graduation Batch</span>
                <span className="font-medium text-slate-700">{selectedStudent.batchYear}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Placement Status</span>
                <span className="font-bold text-emerald-600">{selectedStudent.placementStatus}</span>
              </div>

              {selectedStudent.bio && (
                <div className="pt-2">
                  <span className="font-bold text-slate-700">Bio:</span>
                  <p className="text-slate-600 mt-1">{selectedStudent.bio}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsDirectory;
