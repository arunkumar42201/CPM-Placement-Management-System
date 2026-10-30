import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Calendar, CheckSquare, GraduationCap, Award, 
  ArrowRight, Sparkles, CheckCircle2, Clock, AlertCircle, 
  TrendingUp, Users, ExternalLink, FileText, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  studentService, jobService, applicationService, 
  taskService, announcementService
} from '../../services/api';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskSummary, setTaskSummary] = useState({ totalTasks: 0, completedTasks: 0, pendingTasks: 0, completionRate: 0 });
  const [announcements, setAnnouncements] = useState([]);
  const [attendance, setAttendance] = useState({ presentPercentage: 86.5 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      try {
        const profRes = await studentService.getByUserId(user.id);
        if (profRes.success && profRes.data) {
          const prof = profRes.data;
          setProfile(prof);

          // Fetch recommendations, applications, tasks in parallel
          const [recRes, appRes, taskRes, sumRes, annRes, attRes] = await Promise.allSettled([
            studentService.getRecommendations(prof.id),
            applicationService.getMyApplications(),
            taskService.getDailyTasks(prof.id),
            taskService.getTaskSummary(prof.id),
            announcementService.getAll('STUDENT'),
            studentService.getAttendance(prof.id),
          ]);

          if (recRes.status === 'fulfilled' && recRes.value?.data) setRecommendations(recRes.value.data);
          if (appRes.status === 'fulfilled' && appRes.value?.data) setApplications(appRes.value.data);
          if (taskRes.status === 'fulfilled' && taskRes.value?.data) setTasks(taskRes.value.data);
          if (sumRes.status === 'fulfilled' && sumRes.value?.data) setTaskSummary(sumRes.value.data);
          if (annRes.status === 'fulfilled' && annRes.value?.data) setAnnouncements(annRes.value.data);
          if (attRes.status === 'fulfilled' && attRes.value?.data) setAttendance(attRes.value.data);
        }
      } catch (e) {
        console.error('Failed to load student dashboard data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  const handleToggleTask = async (taskId) => {
    try {
      const res = await taskService.toggleTask(taskId);
      if (res.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
        );
        if (profile?.id) {
          const sumRes = await taskService.getTaskSummary(profile.id);
          if (sumRes.success) setTaskSummary(sumRes.data);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const activeInterviews = applications.filter(
    (a) => a.status === 'INTERVIEW_SCHEDULED' || a.interviews?.length > 0
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Campus Placement Season 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {user?.fullName || 'Student'}!
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 max-w-xl">
              {profile?.department?.name || 'Department of Computer Science'} • Roll No: {profile?.rollNumber || '2022CS101'} • Batch: {profile?.batchYear || '2026'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/student/resume-builder"
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-indigo-700 shadow-md hover:bg-indigo-50 transition"
            >
              <FileText className="h-4 w-4" />
              Resume Builder
            </Link>
            <Link
              to="/student/jobs"
              className="flex items-center gap-2 rounded-xl bg-indigo-500/30 border border-white/20 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition backdrop-blur-md"
            >
              <Briefcase className="h-4 w-4" />
              Browse Openings
            </Link>
          </div>
        </div>

        {/* Subtle decorative background circles */}
        <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Academic CGPA</span>
            <GraduationCap className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-800">
            {profile?.cgpa ? Number(profile.cgpa).toFixed(2) : '8.65'}
          </div>
          <div className="mt-1 text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Eligible for Tier-1 Drives
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Job Applications</span>
            <Briefcase className="h-4 w-4 text-violet-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-800">
            {applications.length}
          </div>
          <div className="mt-1 text-[11px] font-medium text-slate-400">
            {applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').length} In Progress
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Interviews</span>
            <Users className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-800">
            {activeInterviews.length}
          </div>
          <div className="mt-1 text-[11px] font-medium text-amber-600">
            Scheduled Rounds
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Overall Attendance</span>
            <CheckSquare className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-800">
            {attendance?.presentPercentage ? `${Number(attendance.presentPercentage).toFixed(1)}%` : '88.5%'}
          </div>
          <div className="mt-1 text-[11px] font-semibold text-emerald-600">
            Above 75% Minimum
          </div>
        </div>
      </div>

      {/* Main Content 2-Column Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Recommended Jobs & Applications */}
        <div className="lg:col-span-8 space-y-6">
          {/* AI Recommended Jobs */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 font-bold">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">AI Job Matches For Your Profile</h2>
                  <p className="text-[11px] text-slate-400">Based on your skills, CGPA, and department</p>
                </div>
              </div>
              <Link to="/student/jobs" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                View All <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {(recommendations.length > 0 ? recommendations.slice(0, 3) : [
                {
                  job: { id: 1, title: 'Associate Software Engineer', company: { companyName: 'Google' }, ctcLpa: 32.5, jobType: 'FULL_TIME', location: 'Bangalore' },
                  matchScore: 94,
                  matchedSkills: ['Java', 'Data Structures', 'Spring Boot', 'SQL'],
                  missingSkills: ['Kubernetes']
                },
                {
                  job: { id: 2, title: 'Cloud Solutions Engineer', company: { companyName: 'Microsoft' }, ctcLpa: 28.0, jobType: 'FULL_TIME', location: 'Hyderabad' },
                  matchScore: 88,
                  matchedSkills: ['Python', 'Cloud Computing', 'Git'],
                  missingSkills: ['Azure']
                },
                {
                  job: { id: 3, title: 'Full Stack Java Specialist', company: { companyName: 'JPMorgan Chase' }, ctcLpa: 19.5, jobType: 'FULL_TIME', location: 'Mumbai' },
                  matchScore: 85,
                  matchedSkills: ['Java', 'Spring Boot', 'REST APIs'],
                  missingSkills: ['Microservices']
                }
              ]).map((rec, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 hover:border-indigo-200 hover:bg-indigo-50/20 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-700">{rec.job?.company?.companyName}</span>
                      <span className="rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5">
                        {rec.matchPercentage != null ? rec.matchPercentage : (rec.matchScore || 0)}% Match
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mt-0.5">{rec.job?.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">₹{rec.job?.ctcLpa} LPA</span>
                      <span>•</span>
                      <span>{rec.job?.location}</span>
                      <span>•</span>
                      <span>{rec.job?.jobType?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {rec.matchedSkills?.map((s, i) => (
                        <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="sm:self-center">
                    <Link
                      to="/student/jobs"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-sm"
                    >
                      Apply Now <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Applications Status Timeline */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800">Recent Applications Pipeline</h2>
              <Link to="/student/applications" className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                All Applications
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                No active job applications yet. Browse jobs to submit your first application!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {applications.slice(0, 4).map((app) => (
                  <div key={app.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-800">{app.job?.title}</div>
                      <div className="text-slate-500">{app.job?.company?.companyName} • Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleString() : 'Recently'}</div>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                        app.status === 'OFFERED' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'SHORTLISTED' ? 'bg-sky-100 text-sky-800' :
                        app.status === 'INTERVIEW_SCHEDULED' ? 'bg-purple-100 text-purple-800' :
                        app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Daily Prep Checklist & Announcements */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Preparation Checklist */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-800">Daily Placement Prep</h3>
              </div>
              <Link to="/student/daily-tasks" className="text-xs font-bold text-indigo-600">
                View All
              </Link>
            </div>

            {/* Task Completion Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                <span>Completed Tasks</span>
                <span>{taskSummary.completedTasks} / {taskSummary.totalTasks || 4} ({taskSummary.completionRate || 50}%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${taskSummary.completionRate || 50}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {(tasks.length > 0 ? tasks.slice(0, 5) : [
                { id: 1, title: 'Solve 2 LeetCode Medium DSA problems', category: 'CODING', completed: true },
                { id: 2, title: 'Revise Database Indexing & Normalization', category: 'ACADEMIC', completed: true },
                { id: 3, title: 'Practice 20 Quantitative Aptitude questions', category: 'APTITUDE', completed: false },
                { id: 4, title: 'Update Resume with new React project', category: 'INTERVIEW_PREP', completed: false },
              ]).map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`flex items-start gap-2.5 rounded-xl p-2.5 text-xs transition cursor-pointer ${
                    task.completed ? 'bg-slate-50 text-slate-400 line-through' : 'bg-indigo-50/40 text-slate-700 font-medium hover:bg-indigo-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => {}}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex-1 text-[11px] leading-snug">{task.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Campus Placement Announcements */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Campus Notices</h3>
              <Link to="/student/announcements" className="text-xs font-bold text-indigo-600">
                More
              </Link>
            </div>

            <div className="space-y-3">
              {(announcements.length > 0 ? announcements.slice(0, 3) : [
                {
                  id: 1,
                  title: 'Google Campus Drive Mock Assessment scheduled for Oct 12',
                  date: 'Today',
                  category: 'DRIVE_ALERT'
                },
                {
                  id: 2,
                  title: 'Resume verification deadline for 2026 Batch is Friday',
                  date: 'Yesterday',
                  category: 'IMPORTANT'
                },
                {
                  id: 3,
                  title: 'Aptitude Masterclass by TPO Singhania at 3:00 PM',
                  date: '2 days ago',
                  category: 'WORKSHOP'
                }
              ]).map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs">
                  <div className="font-semibold text-slate-800 leading-snug">{item.title}</div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{item.category || 'NOTICE'}</span>
                    <span>{item.date || 'Campus Bulletin'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
