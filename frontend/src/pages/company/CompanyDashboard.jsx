import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, Briefcase, Users, Search, PlusCircle, 
  CheckCircle2, Clock, Calendar, ArrowRight, Sparkles 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobService, applicationService } from '../../services/api';

export const CompanyDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        const companyId = user?.profileId;
        const [jobsRes, appsRes] = await Promise.allSettled([
          companyId ? jobService.getCompanyJobs(companyId) : jobService.getAll(),
          applicationService.getMyCompanyApplications(),
        ]);

        if (jobsRes.status === 'fulfilled') {
          const jobsPayload = Array.isArray(jobsRes.value) ? jobsRes.value : jobsRes.value?.data ?? [];
          setJobs(jobsPayload);
        }

        if (appsRes.status === 'fulfilled') {
          const appsPayload = Array.isArray(appsRes.value) ? appsRes.value : appsRes.value?.data ?? [];
          setApplications(appsPayload);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      loadCompanyData();
    }
  }, [user]);

  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED' || a.status === 'INTERVIEW_SCHEDULED').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Recruiter & Talent Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">
              Welcome, {user?.fullName || 'Recruiter'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Source campus engineering talent, review resumes, evaluate match scores, and conduct interview rounds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/company/jobs/new"
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-emerald-700 shadow-md hover:bg-emerald-50 transition"
            >
              <PlusCircle className="h-4 w-4" />
              Post Job Opening
            </Link>
            <Link
              to="/company/candidate-search"
              className="flex items-center gap-2 rounded-xl bg-emerald-500/30 border border-white/20 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition backdrop-blur-md"
            >
              <Search className="h-4 w-4" />
              AI Candidate Search
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Active Job Postings</span>
          <div className="mt-1 text-2xl font-black text-slate-800">{jobs.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Total Applicants</span>
          <div className="mt-1 text-2xl font-black text-indigo-600">{applications.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Shortlisted for Rounds</span>
          <div className="mt-1 text-2xl font-black text-emerald-600">{shortlistedCount}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Interview Pipeline</span>
          <div className="mt-1 text-2xl font-black text-violet-600">
            {applications.filter(a => a.status === 'INTERVIEW_SCHEDULED').length}
          </div>
        </div>
      </div>

      {/* 2-Column Content */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Recent Applicants */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Recent Applications Received</h3>
            <Link to="/company/applications" className="text-xs font-bold text-indigo-600">
              View All
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No applications received yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.slice(0, 5).map((app) => (
                <div key={app.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-800">{app.studentName || app.student?.user?.fullName || 'Candidate'}</div>
                    <div className="text-slate-500">
                      Applied for {app.jobTitle || app.job?.title || 'Role'}
                      {app.cgpa != null ? ` • CGPA: ${app.cgpa}` : ''}
                    </div>
                  </div>
                  <div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                      {app.status?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Active Jobs */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Posted Openings</h3>
            <Link to="/company/jobs" className="text-xs font-bold text-indigo-600">
              Manage
            </Link>
          </div>

          <div className="space-y-3">
            {jobs.slice(0, 4).map((j) => (
              <div key={j.id} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3 text-xs">
                <div className="font-bold text-slate-800">{j.title}</div>
                <div className="mt-1 flex items-center justify-between text-slate-500 text-[11px]">
                  <span>₹{j.ctcLpa} LPA</span>
                  <span>{j.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
