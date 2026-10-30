import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, DollarSign, MapPin, Calendar, CheckCircle2, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobService, placementCellService, aiService } from '../../services/api';

export const PostJob = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [companyId, setCompanyId] = useState(user?.profileId ?? null);
  const [form, setForm] = useState({
    title: '',
    jobType: 'FULL_TIME',
    ctcLpa: 14.0,
    minCgpa: 7.0,
    location: 'Bangalore / Remote',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    description: '',
    requirements: '',
    requiredSkills: 'Java, Spring Boot, React, SQL',
  });

  const handleAiGenerateJob = async () => {
    if (!form.title.trim()) {
      alert('Please enter a Role Title first (e.g. Associate Software Engineer, Data Analyst, Cloud DevOps)!');
      return;
    }
    setGeneratingAi(true);
    try {
      const res = await aiService.generateJob({
        title: form.title,
        jobType: form.jobType,
        experienceLevel: 'Campus Graduate / Fresher'
      });
      if (res.success && res.data) {
        setForm(prev => ({
          ...prev,
          description: res.data.description || prev.description,
          requirements: res.data.requirements || prev.requirements,
          requiredSkills: Array.isArray(res.data.skills) ? res.data.skills.join(', ') : (res.data.skills || prev.requiredSkills),
        }));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate with AI: ' + (err.message || 'Unknown error'));
    } finally {
      setGeneratingAi(false);
    }
  };

  const resolveCompanyId = async () => {
    if (!user) return null;

    if (user.profileId) {
      setCompanyId(user.profileId);
      return user.profileId;
    }

    try {
      const res = await placementCellService.getCompanies();
      const companies = Array.isArray(res) ? res : res?.data ?? [];
      const matchedCompany = companies.find((company) => {
        const candidateUserId = company?.user?.id ?? company?.userId ?? company?.user?.userId;
        return candidateUserId != null && Number(candidateUserId) === Number(user.id);
      });

      if (matchedCompany) {
        const resolvedId = matchedCompany.id;
        setCompanyId(resolvedId);
        updateUserProfile({ profileId: resolvedId });
        return resolvedId;
      }
    } catch (e) {
      console.error('Failed to resolve company profile for current user:', e);
    }

    return null;
  };

  useEffect(() => {
    if (user) {
      resolveCompanyId();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resolvedCompanyId = companyId || (await resolveCompanyId());
    if (!resolvedCompanyId) {
      alert('Company profile could not be resolved. Please complete the company profile or wait for approval before posting a job.');
      return;
    }
    setSubmitting(true);
    try {
      await jobService.create(resolvedCompanyId, {
        ...form,
        salary: form.ctcLpa,
        status: 'PENDING',
      });
      alert('Job submitted successfully and sent to the administration for approval.');
      navigate('/company/jobs');
    } catch (e) {
      alert('Failed to post job: ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Post New Campus Job Opening</h1>
        <p className="text-xs text-slate-500">Publish employment and internship roles for campus recruitment</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-700">Role Title</label>
              <button
                type="button"
                onClick={handleAiGenerateJob}
                disabled={generatingAi}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-[11px] shadow-sm hover:opacity-95 transition disabled:opacity-50"
              >
                {generatingAi ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    AI Crafting Description...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3 text-amber-300" />
                    ✨ Auto-Fill with AI
                  </>
                )}
              </button>
            </div>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-slate-800 focus:border-indigo-500 focus:outline-none"
              placeholder="e.g. Associate Software Engineer - Cloud Platforms"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-bold text-slate-700">Job Type</label>
              <select
                value={form.jobType}
                onChange={(e) => setForm({ ...form, jobType: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-indigo-500 focus:outline-none"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="INTERNSHIP_PPO">Internship + PPO</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700">Annual CTC (in ₹ LPA)</label>
              <input
                type="number"
                step="0.1"
                required
                value={form.ctcLpa}
                onChange={(e) => setForm({ ...form, ctcLpa: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-800"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block font-bold text-slate-700">Minimum CGPA Required</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                value={form.minCgpa}
                onChange={(e) => setForm({ ...form, minCgpa: Number(e.target.value) })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700">Work Location</label>
              <input
                type="text"
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-800"
                placeholder="e.g. Bangalore, Hyderabad or Remote"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700">Application Deadline</label>
            <input
              type="date"
              required
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700">Required Skills (Comma separated)</label>
            <input
              type="text"
              required
              value={form.requiredSkills}
              onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-slate-800"
              placeholder="Java, Spring Boot, React, Docker..."
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700">Job Role & Responsibilities Description</label>
            <textarea
              rows={4}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-slate-800 focus:border-indigo-500 focus:outline-none"
              placeholder="Outline role responsibilities, tech stacks, and team expectations..."
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700">Candidate Requirements & Qualifications</label>
            <textarea
              rows={3}
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-200 p-3 text-slate-800 focus:border-indigo-500 focus:outline-none"
              placeholder="Degree requirements, graduation batch, specific skill proficiencies..."
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/company/jobs')}
              className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {submitting ? 'Publishing...' : 'Publish Job Opening'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
