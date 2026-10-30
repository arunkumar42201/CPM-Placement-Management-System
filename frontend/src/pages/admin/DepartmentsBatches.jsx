import React, { useState, useEffect } from 'react';
import { GraduationCap, Plus, BookOpen, Layers } from 'lucide-react';
import { adminService } from '../../services/api';

export const DepartmentsBatches = () => {
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Department Modal
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: '', code: '', hodName: '' });

  const loadData = async () => {
    try {
      const [dRes, bRes, cRes] = await Promise.allSettled([
        adminService.getDepartments(),
        adminService.getBatches(),
        adminService.getCourses(),
      ]);
      if (dRes.status === 'fulfilled' && dRes.value?.data) setDepartments(dRes.value.data);
      if (bRes.status === 'fulfilled' && bRes.value?.data) setBatches(bRes.value.data);
      if (cRes.status === 'fulfilled' && cRes.value?.data) setCourses(cRes.value.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateDept = async (e) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.code) return;
    try {
      await adminService.createDepartment(deptForm);
      setShowDeptModal(false);
      setDeptForm({ name: '', code: '', hodName: '' });
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Departments, Courses & Batches</h1>
          <p className="text-xs text-slate-500">Configure university academic hierarchy, branch codes, and graduation batches</p>
        </div>

        <button
          onClick={() => setShowDeptModal(true)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition"
        >
          <Plus className="h-4 w-4" /> Add Department
        </button>
      </div>

      {/* Departments Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800">Academic Departments</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <div key={d.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-black text-indigo-700">
                  {d.code}
                </span>
                <span className="text-xs text-slate-400">HOD: {d.hodName || 'Dr. Sharma'}</span>
              </div>
              <h3 className="text-base font-bold text-slate-800">{d.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Courses & Batches 2-Column */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Courses */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Degree Courses</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {courses.slice(0, 6).map((c) => (
              <div key={c.id} className="py-2.5 flex items-center justify-between">
                <span className="font-semibold text-slate-700">{c.name}</span>
                <span className="font-bold text-indigo-600">{c.code}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Batches */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Graduation Batches</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {(batches.length > 0 ? batches : [
              { id: 1, name: 'Batch 2026', passingYear: 2026 },
              { id: 2, name: 'Batch 2025', passingYear: 2025 },
              { id: 3, name: 'Batch 2027', passingYear: 2027 },
            ]).map((b) => (
              <div key={b.id} className="py-2.5 flex items-center justify-between">
                <span className="font-semibold text-slate-700">{b.name}</span>
                <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-slate-600">{b.passingYear}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-800">Add Academic Department</h3>
            <form onSubmit={handleCreateDept} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700">Department Name</label>
                <input
                  type="text"
                  required
                  value={deptForm.name}
                  onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  placeholder="e.g. Artificial Intelligence & Data Science"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Code</label>
                  <input
                    type="text"
                    required
                    value={deptForm.code}
                    onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                    placeholder="e.g. AI-DS"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Head of Department</label>
                  <input
                    type="text"
                    value={deptForm.hodName}
                    onChange={(e) => setDeptForm({ ...deptForm, hodName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                    placeholder="e.g. Dr. Verma"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white shadow-sm"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsBatches;
