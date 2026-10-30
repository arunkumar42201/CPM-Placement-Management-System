import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Search, Filter, MapPin, Building2, Calendar, 
  CheckCircle2, XCircle, ArrowRight, Sparkles, Send, Eye,
  AlertCircle, ChevronRight, DollarSign 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobService, applicationService, studentService } from '../../services/api';

export const StudentJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  
  // Apply Modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');

  const loadJobsData = async () => {
    if (!user?.id) return;
    try {
      const [profRes, jobsRes] = await Promise.all([
        studentService.getByUserId(user.id),
        jobService.getAll('ACTIVE'),
      ]);

      if (profRes.success && profRes.data) {
        setProfile(profRes.data);
        const appsRes = await applicationService.getMyApplications();
        if (appsRes.success) setApplications(appsRes.data || []);
      }
      if (jobsRes.success && jobsRes.data) {
        setJobs((jobsRes.data || []).filter((job) =>
          !job.status || String(job.status).toUpperCase() === 'ACTIVE'));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobsData();
  }, [user]);

  useEffect(() => {
    const refreshJobsWhenVisible = () => {
      if (document.visibilityState === 'visible') loadJobsData();
    };
    const refreshTimer = window.setInterval(loadJobsData, 15000);
    window.addEventListener('focus', refreshJobsWhenVisible);
    document.addEventListener('visibilitychange', refreshJobsWhenVisible);
    return () => {
      window.clearInterval(refreshTimer);
      window.removeEventListener('focus', refreshJobsWhenVisible);
      document.removeEventListener('visibilitychange', refreshJobsWhenVisible);
    };
  }, [user]);

  const appliedJobIds = new Set(applications.map((a) => a.job?.id));

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || job.jobType === typeFilter;
    return matchesSearch && matchesType;
  });

  const checkEligibility = (job) => {
    if (!profile) return { eligible: true };
    const studentCgpa = Number(profile.cgpa || 0);
    const minCgpa = Number(job.minCgpa || 0);
    if (studentCgpa < minCgpa) {
      return { eligible: false, reason: `Min CGPA required: ${minCgpa} (Yours: ${studentCgpa})` };
    }
    return { eligible: true };
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!profile?.id || !selectedJob?.id) return;
    setApplying(true);
    try {
      await applicationService.apply(selectedJob.id, coverNote);
      setApplySuccess(`Successfully applied for ${selectedJob.title}!`);
      setShowApplyModal(false);
      setCoverNote('');
      loadJobsData();
      setTimeout(() => setApplySuccess(''), 5000);
    } catch (e) {
      alert('Application failed: ' + e.message);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Campus Jobs & Opportunities</h1>
          <p className="text-xs text-slate-500">Explore openings from verified recruiters visiting campus</p>
        </div>
        {applySuccess && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-4 w-4" />
            {applySuccess}
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by role title, company, or tech stack..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-xs focus:border-indigo-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none"
          >
            <option value="ALL">All Job Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="INTERNSHIP_PPO">Internship + PPO</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-xs text-indigo-800">
        Your profile CGPA is <strong>{profile?.cgpa ?? 'not set'}</strong>. Jobs with a higher minimum CGPA cannot be applied for until your academic profile is updated.
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No job openings matching your search criteria.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => {
            const hasApplied = appliedJobIds.has(job.id);
            const { eligible, reason } = checkEligibility(job);

            return (
              <div
                key={job.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-indigo-600">
                        {job.company?.companyName || 'Campus Partner'}
                      </span>
                      <h3 className="text-base font-bold text-slate-800 mt-0.5">{job.title}</h3>
                    </div>
                    <span className="rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-700">
                      {job.jobType?.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                    {job.description || 'Full-time software engineering role.'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                    <span className="rounded-md bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">
                      ₹{job.ctcLpa ?? job.salary ?? 'Negotiable'} LPA
                    </span>
                    <span className="rounded-md bg-slate-100 px-2.5 py-1">
                      {job.location}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2.5 py-1">
                      Min CGPA: {job.minCgpa}
                    </span>
                  </div>

                  {/* Eligibility Badge */}
                  <div className="mt-3">
                    {eligible ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Eligible to Apply
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-500">
                        <XCircle className="h-3.5 w-3.5" /> {reason}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Deadline: {job.deadline || 'Rolling'}
                  </span>

                  {hasApplied ? (
                    <span className="rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                      Applied ✓
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedJob(job);
                        setShowApplyModal(true);
                      }}
                      disabled={!eligible}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Apply for {selectedJob.title}</h3>
                <p className="text-xs text-slate-500">{selectedJob.company?.companyName} • ₹{selectedJob.ctcLpa ?? selectedJob.salary ?? 'Negotiable'} LPA</p>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="rounded-xl bg-indigo-50/60 p-3 text-xs text-slate-600">
              <span className="font-bold text-indigo-900">Your profile details</span> (CGPA {profile?.cgpa}, {profile?.department?.name}, and skills) will be automatically attached to this application.
            </div>

            <form onSubmit={handleApply} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700">Cover Note / Message to Recruiter (Optional)</label>
                <textarea
                  rows={4}
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-slate-800 focus:border-indigo-500 focus:outline-none"
                  placeholder="Explain why you are an ideal fit for this engineering role and mention key relevant projects..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white hover:bg-indigo-700 shadow-sm"
                >
                  <Send className="h-3.5 w-3.5" />
                  {applying ? 'Submitting...' : 'Confirm Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentJobs;
