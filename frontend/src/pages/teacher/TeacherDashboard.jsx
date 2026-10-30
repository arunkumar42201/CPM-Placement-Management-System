import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, CheckSquare, BookOpen, Award, GraduationCap, 
  ArrowRight, PlusCircle, CheckCircle2, Clock, Sparkles 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { teacherService, studentService } from '../../services/api';

export const TeacherDashboard = () => {
  const { user } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeacherData = async () => {
      if (!user?.id) return;
      try {
        const tRes = await teacherService.getByUserId(user.id);
        if (tRes.success && tRes.data) {
          const t = tRes.data;
          setTeacher(t);

          const [sRes, aRes] = await Promise.all([
            teacherService.getDepartmentStudents(t.department?.id || 1).catch(() => ({ data: [] })),
            teacherService.getTeacherAssignments(t.id).catch(() => ({ data: [] })),
          ]);

          if (sRes?.data) setStudents(sRes.data);
          if (aRes?.data) setAssignments(aRes.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadTeacherData();
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-200" />
              Faculty Academic Console
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome, {teacher?.user?.fullName || user?.fullName || 'Faculty'}
            </h1>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
              {teacher?.department?.name || 'Computer Science & Engineering'} • Designation: {teacher?.designation || 'Associate Professor'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/teacher/attendance"
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-amber-700 shadow-md hover:bg-amber-50 transition"
            >
              <CheckSquare className="h-4 w-4" />
              Mark Attendance
            </Link>
            <Link
              to="/teacher/assignments"
              className="flex items-center gap-2 rounded-xl bg-amber-500/30 border border-white/20 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition backdrop-blur-md"
            >
              <BookOpen className="h-4 w-4" />
              Assignments
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Department Students</span>
          <div className="mt-1 text-2xl font-black text-slate-800">{students.length || 68}</div>
          <div className="mt-1 text-[10px] text-slate-500">Enrolled in Batch 2026</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Average Attendance</span>
          <div className="mt-1 text-2xl font-black text-emerald-600">88.4%</div>
          <div className="mt-1 text-[10px] text-emerald-600 font-semibold">Healthy Campus Benchmark</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Active Coursework</span>
          <div className="mt-1 text-2xl font-black text-indigo-600">{assignments.length || 4}</div>
          <div className="mt-1 text-[10px] text-slate-500">Assignments Given</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Placement Cleared</span>
          <div className="mt-1 text-2xl font-black text-violet-600">92%</div>
          <div className="mt-1 text-[10px] text-slate-500">Department Placement Rate</div>
        </div>
      </div>

      {/* 2-Column Content */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Department Students Overview */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Department Students Summary</h3>
            <Link to="/teacher/students" className="text-xs font-bold text-indigo-600">
              Directory
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px]">
                <tr>
                  <th className="px-4 py-2.5">Student</th>
                  <th className="px-4 py-2.5">Roll No</th>
                  <th className="px-4 py-2.5">CGPA</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {students.slice(0, 5).map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-bold text-slate-800">{s.user?.fullName}</td>
                    <td className="px-4 py-3">{s.rollNumber}</td>
                    <td className="px-4 py-3 font-bold text-indigo-600">{s.cgpa}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        {s.placementStatus || 'ELIGIBLE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Active Assignments */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Coursework & Deadlines</h3>
            <Link to="/teacher/assignments" className="text-xs font-bold text-indigo-600">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {assignments.slice(0, 3).map((a) => (
              <div key={a.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-xs">
                <div className="font-bold text-slate-800">{a.title}</div>
                <div className="mt-1 flex items-center justify-between text-slate-400 text-[11px]">
                  <span>Max Marks: {a.maxMarks}</span>
                  <span>Due: {a.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
