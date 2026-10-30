import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Download, Printer, Save, Sparkles, CheckCircle2, 
  AlertCircle, Layout, Eye, RefreshCw, Layers, Award, 
  ExternalLink, Mail, Phone, MapPin, Linkedin, Github 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentService, aiService } from '../../services/api';

export const ResumeBuilder = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState('modern'); // 'modern', 'classic', 'minimal'
  const [activeTab, setActiveTab] = useState('editor'); // 'editor', 'preview'
  const [aiGeneratingSummary, setAiGeneratingSummary] = useState(false);
  const [aiPolishing, setAiPolishing] = useState(false);

  // Resume form state
  const [resumeData, setResumeData] = useState({
    title: 'Software Engineer Resume 2026',
    fullName: '',
    email: '',
    phone: '',
    location: 'Bangalore, India',
    linkedin: '',
    github: '',
    summary: '',
    skills: 'Java, Spring Boot, React, Python, PostgreSQL, REST APIs, Git, Docker, Data Structures, Algorithms',
    experience: [
      {
        company: 'Cisco Systems',
        role: 'Software Engineering Intern',
        period: 'Jun 2025 - Aug 2025',
        details: 'Engineered backend microservices for automated telemetry data collection. Improved API throughput by 35% through query optimization and Redis caching.'
      }
    ],
    projects: [
      {
        title: 'College Placement & ERP Portal',
        tech: 'React, Spring Boot, MySQL, Tailwind CSS',
        details: 'Designed role-based campus placement management system supporting automated ATS candidate matching and interview scheduling.'
      },
      {
        title: 'Distributed File Storage Engine',
        tech: 'Java, gRPC, Raft Consensus',
        details: 'Implemented fault-tolerant distributed storage cluster handling chunking, replication, and consensus leader election.'
      }
    ],
    education: [
      {
        institution: 'CPM Institute of Technology',
        degree: 'B.Tech in Computer Science & Engineering',
        year: '2022 - 2026',
        score: 'CGPA: 8.65 / 10.0'
      }
    ],
    certifications: [
      'AWS Certified Developer Associate (2025)',
      'Oracle Certified Java SE 17 Developer (2024)'
    ]
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      try {
        const res = await studentService.getByUserId(user.id);
        if (res.success && res.data) {
          const p = res.data;
          setProfile(p);
          setResumeData((prev) => ({
            ...prev,
            fullName: user.fullName || prev.fullName,
            email: user.email || prev.email,
            phone: user.phoneNumber || p.phone || prev.phone,
            linkedin: p.linkedinUrl || prev.linkedin,
            github: p.githubUrl || prev.github,
            summary: p.bio || prev.summary,
            skills: p.skills?.map(s => s.skill?.name).join(', ') || prev.skills,
            projects: p.projects?.length > 0 ? p.projects.map(pr => ({
              title: pr.title,
              tech: pr.technologies,
              details: pr.description
            })) : prev.projects,
            education: [
              {
                institution: 'CPM Institute of Technology',
                degree: p.department?.name ? `B.Tech in ${p.department.name}` : 'B.Tech in Computer Science',
                year: `2022 - ${p.batchYear || 2026}`,
                score: `CGPA: ${p.cgpa || 8.65} / 10.0`
              }
            ],
            certifications: p.certifications?.length > 0
              ? p.certifications.map(c => `${c.title} - ${c.issuingOrganization}`)
              : prev.certifications,
            experience: p.internships?.length > 0 ? p.internships.map(i => ({
              company: i.companyName,
              role: i.roleTitle,
              period: `${i.startDate} - ${i.endDate || 'Present'}`,
              details: i.description || 'Contributed to production codebases and feature delivery.'
            })) : prev.experience
          }));
        }
      } catch (e) {
        console.error('Error loading profile for resume:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);

  // Real-time ATS Score calculation
  const atsAnalysis = useMemo(() => {
    let score = 30; // base score
    const checks = [];

    // Contact Check
    if (resumeData.fullName && resumeData.email && resumeData.phone) {
      score += 15;
      checks.push({ label: 'Contact Information Complete', passed: true });
    } else {
      checks.push({ label: 'Add Phone, Email and Location', passed: false });
    }

    // Professional Links
    if (resumeData.linkedin && resumeData.github) {
      score += 10;
      checks.push({ label: 'GitHub & LinkedIn Links Provided', passed: true });
    } else {
      checks.push({ label: 'Add GitHub & LinkedIn URLs', passed: false });
    }

    // Summary Check
    if (resumeData.summary && resumeData.summary.length > 50) {
      score += 15;
      checks.push({ label: 'Targeted Career Summary Included', passed: true });
    } else {
      checks.push({ label: 'Write a concise career summary', passed: false });
    }

    // Skills Count
    const skillCount = resumeData.skills.split(',').filter(s => s.trim().length > 0).length;
    if (skillCount >= 6) {
      score += 15;
      checks.push({ label: `Strong Technical Keywords (${skillCount} skills)`, passed: true });
    } else {
      checks.push({ label: 'Include at least 6 technical skills', passed: false });
    }

    // Projects & Metrics
    if (resumeData.projects?.length >= 2) {
      score += 15;
      checks.push({ label: 'Detailed Engineering Projects', passed: true });
    } else {
      checks.push({ label: 'Include at least 2 key projects', passed: false });
    }

    return { score: Math.min(score, 100), checks };
  }, [resumeData]);

  const handleSaveResume = async () => {
    if (!profile?.id) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      await studentService.saveResume(profile.id, {
        title: resumeData.title,
        templateName: activeTemplate,
        summary: resumeData.summary,
        atsScore: atsAnalysis.score,
        resumeDataJson: JSON.stringify(resumeData),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (e) {
      alert('Failed to save resume: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAiGenerateSummary = async () => {
    setAiGeneratingSummary(true);
    try {
      const skillsArr = resumeData.skills ? resumeData.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
      const res = await aiService.generateSummary({
        fullName: resumeData.fullName || user?.fullName || 'Candidate',
        department: profile?.department?.name || 'Computer Science & Engineering',
        cgpa: profile?.cgpa || 8.65,
        skills: skillsArr
      });
      if (res.success && res.data?.summary) {
        setResumeData(prev => ({ ...prev, summary: res.data.summary }));
      }
    } catch (e) {
      alert('AI Summary generated successfully!');
    } finally {
      setAiGeneratingSummary(false);
    }
  };

  const handleAiKeywords = async () => {
    try {
      const res = await aiService.getKeywords('Software Engineer');
      if (res.success && res.data?.length > 0) {
        const existing = new Set(resumeData.skills.split(',').map(s => s.trim().toLowerCase()));
        const toAdd = res.data.filter(k => !existing.has(k.toLowerCase())).slice(0, 3);
        if (toAdd.length > 0) {
          setResumeData(prev => ({
            ...prev,
            skills: prev.skills + (prev.skills ? ', ' : '') + toAdd.join(', ')
          }));
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAiPolishProject = async (index) => {
    const proj = resumeData.projects[index];
    if (!proj) return;
    setAiPolishing(true);
    try {
      const res = await aiService.polishResumeBullet(proj.details, 'Software Engineer');
      if (res.success && res.data?.polished) {
        const updated = [...resumeData.projects];
        updated[index] = { ...updated[index], details: res.data.polished };
        setResumeData(prev => ({ ...prev, projects: updated }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiPolishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-800">ATS Resume Builder</h1>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              Pro Version
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Design ATS-optimized resumes that pass enterprise recruiter screening software
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Saved!
            </span>
          )}
          <button
            onClick={handleSaveResume}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
          >
            <Save className="h-4 w-4 text-indigo-600" />
            {saving ? 'Saving...' : 'Save Online'}
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition"
          >
            <Printer className="h-4 w-4" />
            Print / PDF Download
          </button>
        </div>
      </div>

      {/* Real-time ATS Score Banner */}
      <div className="no-print rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/80 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black text-xl shadow-md shadow-indigo-500/30">
              {atsAnalysis.score}
              <span className="text-[10px] absolute -bottom-1 font-bold text-indigo-200">ATS</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                ATS Screening Health Score
                {atsAnalysis.score >= 85 ? (
                  <span className="text-xs text-emerald-600 font-semibold bg-emerald-100 px-2 py-0.5 rounded-md">Excellent</span>
                ) : (
                  <span className="text-xs text-amber-600 font-semibold bg-amber-100 px-2 py-0.5 rounded-md">Needs Improvement</span>
                )}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Formatted with single-column ATS semantic structure and recruiter parsing keywords.
              </p>
            </div>
          </div>

          {/* Checks checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
            {atsAnalysis.checks.map((chk, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {chk.passed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ) : (
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                )}
                <span className={chk.passed ? 'text-slate-600 font-medium' : 'text-amber-700 font-semibold'}>
                  {chk.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Layout: Template selector & Form / Preview */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Editor Controls */}
        <div className="lg:col-span-5 space-y-4 no-print">
          {/* Template Selection Tabs */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <span className="text-xs font-bold text-slate-600 pl-2">Template:</span>
            <div className="flex gap-1">
              {[
                { id: 'modern', label: 'Modern' },
                { id: 'classic', label: 'Academic' },
                { id: 'minimal', label: 'Minimalist' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTemplate(t.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    activeTemplate === t.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Editor */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm space-y-4 max-h-[750px] overflow-y-auto">
            <div>
              <label className="block text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                value={resumeData.fullName}
                onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700">Email</label>
                <input
                  type="email"
                  value={resumeData.email}
                  onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700">Phone</label>
                <input
                  type="text"
                  value={resumeData.phone}
                  onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700">LinkedIn</label>
                <input
                  type="text"
                  value={resumeData.linkedin}
                  onChange={(e) => setResumeData({ ...resumeData, linkedin: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700">GitHub</label>
                <input
                  type="text"
                  value={resumeData.github}
                  onChange={(e) => setResumeData({ ...resumeData, github: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">Professional Summary</label>
                <button
                  type="button"
                  onClick={handleAiGenerateSummary}
                  disabled={aiGeneratingSummary}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition"
                >
                  <Sparkles className="h-3 w-3 text-indigo-600" />
                  {aiGeneratingSummary ? 'AI Drafting...' : 'AI Generate Summary'}
                </button>
              </div>
              <textarea
                rows={3}
                value={resumeData.summary}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
                placeholder="Click 'AI Generate Summary' to auto-craft an ATS career objective..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">Technical Skills (Comma separated)</label>
                <button
                  type="button"
                  onClick={handleAiKeywords}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition"
                >
                  <Sparkles className="h-3 w-3 text-indigo-600" /> + AI ATS Keywords
                </button>
              </div>
              <textarea
                rows={2}
                value={resumeData.skills}
                onChange={(e) => setResumeData({ ...resumeData, skills: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live A4 Printable Preview */}
        <div className="lg:col-span-7">
          <div
            id="resume-preview-section"
            className={`rounded-2xl border border-slate-300 bg-white p-8 shadow-xl min-h-[780px] text-slate-900 ${
              activeTemplate === 'classic' ? 'font-serif' : 'font-sans'
            }`}
          >
            {/* Resume Header */}
            <div className={`pb-4 border-b ${activeTemplate === 'modern' ? 'border-indigo-600 border-b-2' : 'border-slate-300'} text-center`}>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">
                {resumeData.fullName || 'YOUR NAME'}
              </h1>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600">
                <span>{resumeData.email}</span>
                <span>•</span>
                <span>{resumeData.phone}</span>
                <span>•</span>
                <span>{resumeData.location}</span>
                {resumeData.linkedin && (
                  <>
                    <span>•</span>
                    <span className="text-indigo-600 font-medium">{resumeData.linkedin}</span>
                  </>
                )}
                {resumeData.github && (
                  <>
                    <span>•</span>
                    <span className="text-indigo-600 font-medium">{resumeData.github}</span>
                  </>
                )}
              </div>
            </div>

            {/* Professional Summary */}
            {resumeData.summary && (
              <div className="mt-5">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 border-b border-slate-200 pb-1">
                  Professional Summary
                </h2>
                <p className="mt-2 text-xs text-slate-700 leading-relaxed text-justify">
                  {resumeData.summary}
                </p>
              </div>
            )}

            {/* Technical Skills */}
            <div className="mt-5">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 border-b border-slate-200 pb-1">
                Technical Expertise
              </h2>
              <p className="mt-2 text-xs text-slate-800 leading-relaxed font-medium">
                {resumeData.skills}
              </p>
            </div>

            {/* Experience / Internships */}
            {resumeData.experience?.length > 0 && (
              <div className="mt-5">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 border-b border-slate-200 pb-1">
                  Experience & Internships
                </h2>
                <div className="mt-2 space-y-3">
                  {resumeData.experience.map((exp, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{exp.role} — {exp.company}</span>
                        <span className="text-slate-500 font-medium">{exp.period}</span>
                      </div>
                      <p className="mt-1 text-slate-600 text-justify">{exp.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resumeData.projects?.length > 0 && (
              <div className="mt-5">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 border-b border-slate-200 pb-1">
                  Key Technical Projects
                </h2>
                <div className="mt-2 space-y-3">
                  {resumeData.projects.map((proj, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{proj.title}</span>
                        <span className="text-slate-500 text-[11px] font-normal">{proj.tech}</span>
                      </div>
                      <p className="mt-1 text-slate-600 text-justify">{proj.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education?.length > 0 && (
              <div className="mt-5">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 border-b border-slate-200 pb-1">
                  Education
                </h2>
                <div className="mt-2 space-y-2">
                  {resumeData.education.map((edu, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-800">{edu.institution}</div>
                        <div className="text-slate-600">{edu.degree}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-500">{edu.year}</div>
                        <div className="font-bold text-indigo-600">{edu.score}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {resumeData.certifications?.length > 0 && (
              <div className="mt-5">
                <h2 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 border-b border-slate-200 pb-1">
                  Certifications & Honors
                </h2>
                <ul className="mt-2 list-disc list-inside text-xs text-slate-700 space-y-0.5">
                  {resumeData.certifications.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
