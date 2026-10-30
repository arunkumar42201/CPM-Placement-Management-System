import React, { useState, useEffect, useCallback } from 'react';
import { Search, Sparkles, Filter, CheckCircle2, AlertCircle, RefreshCw, GraduationCap, Award, ExternalLink, Mail } from 'lucide-react';
import { jobService, candidateMatchingService } from '../../services/api';

export const CandidateSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [matches, setMatches] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [error, setError] = useState(null);
  const [minCgpaFilter, setMinCgpaFilter] = useState(6.0);

  useEffect(() => {
    const loadJobs = async () => {
      setLoadingJobs(true);
      setError(null);
      try {
        const res = await jobService.getAll('ACTIVE');
        if (res.success && res.data) {
          setJobs(res.data);
          if (res.data.length > 0) {
            setSelectedJobId(res.data[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load active jobs:', err);
        setError(err.message || 'Unable to load active jobs. Please try again.');
      } finally {
        setLoadingJobs(false);
      }
    };
    loadJobs();
  }, []);

  const fetchMatches = useCallback(async () => {
    if (!selectedJobId) {
      setMatches([]);
      return;
    }
    setLoadingMatches(true);
    setError(null);
    try {
      const res = await candidateMatchingService.matchCandidatesForJob(selectedJobId);
      if (res.success && res.data) {
        setMatches(res.data);
      } else {
        setMatches([]);
      }
    } catch (err) {
      console.error('Failed to load candidate matches:', err);
      setMatches([]);
      setError(err.message || 'Unable to load candidate matches. Please try again.');
    } finally {
      setLoadingMatches(false);
    }
  }, [selectedJobId]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const filteredMatches = matches.filter((m) => {
    const cgpa = Number(m.cgpa || 0);
    return cgpa >= minCgpaFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-800">AI Candidate Matching Engine</h1>
            <span className="flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> Match Score AI
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Automatically rank campus candidates based on job skill requirements, CGPA criteria, and project experience
          </p>
        </div>
      </div>

      {/* Target Job Selector & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-700 mb-1">Select Job Opening to Match Against:</label>
          {loadingJobs ? (
            <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          ) : jobs.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No active job openings found.</p>
          ) : (
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-bold text-slate-800 focus:border-indigo-500 focus:outline-none"
            >
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} — {j.company?.companyName} (₹{j.ctcLpa} LPA)
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="w-full sm:w-48">
          <label className="block text-xs font-bold text-slate-700 mb-1">Minimum CGPA: {minCgpaFilter}</label>
          <input
            type="range"
            min="5.0"
            max="9.5"
            step="0.1"
            value={minCgpaFilter}
            onChange={(e) => setMinCgpaFilter(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Candidate Matches State Management */}
      {loadingMatches ? (
        <div className="flex h-64 flex-col items-center justify-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-xs text-slate-500 font-medium">Calculating candidate match scores...</p>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-8 text-center text-xs text-rose-700 space-y-3">
          <div className="flex items-center justify-center gap-2 font-bold text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Failed to Load Candidates</span>
          </div>
          <p className="max-w-md mx-auto">{error}</p>
          <button
            onClick={fetchMatches}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 transition"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No job openings available. Please post an opening to evaluate candidate matches.
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          No candidates found matching the selected minimum CGPA or criteria.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMatches.map((item, idx) => (
            <div
              key={item.studentId || idx}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">{item.fullName || 'Student'}</h3>
                    <p className="text-xs text-slate-500">
                      Roll: {item.rollNumber || 'N/A'} • {item.departmentName || 'N/A'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="rounded-full bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-0.5">
                      {item.overallMatchPercentage}%
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Match Score</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 text-xs">
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 font-bold text-slate-700">
                    CGPA: {item.cgpa != null ? Number(item.cgpa).toFixed(2) : 'N/A'}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-600">
                    Backlogs: {item.activeBacklogs != null ? item.activeBacklogs : 0}
                  </span>
                </div>

                {/* Matched Skills */}
                <div className="mt-4 space-y-1">
                  <span className="text-[11px] font-bold text-slate-500">Matching Required Skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {item.matchedSkills && item.matchedSkills.length > 0 ? (
                      item.matchedSkills.map((s, i) => (
                        <span key={i} className="rounded bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 text-[10px] font-semibold">
                          ✓ {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">None matched</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                {item.missingSkills && item.missingSkills.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <span className="text-[11px] font-bold text-slate-400">Missing Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {item.missingSkills.map((s, i) => (
                        <span key={i} className="rounded bg-rose-50 text-rose-600 px-2 py-0.5 text-[10px]">
                          ✕ {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Eligibility Notes */}
                {item.eligibilityNotes && item.eligibilityNotes.length > 0 && (
                  <div className="mt-3 space-y-0.5">
                    {item.eligibilityNotes.map((note, i) => (
                      <p key={i} className="text-[10px] text-slate-500">
                        • {note}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-xs font-semibold ${item.isEligible ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {item.isEligible ? 'ELIGIBLE' : 'CRITERIA NOT MET'}
                </span>
                {item.email ? (
                  <a
                    href={`mailto:${item.email}`}
                    className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition"
                  >
                    Contact Candidate
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">No Email</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateSearch;
