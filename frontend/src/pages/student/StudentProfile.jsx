import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, MapPin, Globe, Linkedin, Github, 
  GraduationCap, Award, Briefcase, Code, Plus, Trash2, 
  Save, CheckCircle2, AlertCircle, Edit3, ExternalLink 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { studentService, adminService } from '../../services/api';

export const StudentProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [skillsList, setSkillsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [profileLoadError, setProfileLoadError] = useState('');

  // Modals for Adding Skill / Project / Cert / Internship
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [skillProficiency, setSkillProficiency] = useState('INTERMEDIATE');
  const [addingSkill, setAddingSkill] = useState(false);
  const [skillError, setSkillError] = useState('');

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', technologies: '', repoUrl: '', liveUrl: '' });

  const [showCertModal, setShowCertModal] = useState(false);
  const [certForm, setCertForm] = useState({ title: '', issuingOrganization: '', issueDate: '', certificateUrl: '' });

  const [showInternshipModal, setShowInternshipModal] = useState(false);
  const [internshipForm, setInternshipForm] = useState({ companyName: '', roleTitle: '', startDate: '', endDate: '', description: '' });

  const loadData = async () => {
    if (!user?.id) return;
    try {
      let profRes;
      try {
        profRes = await studentService.getByUserId(user.id);
      } catch (userLookupError) {
        if (!user.profileId) throw userLookupError;
        profRes = await studentService.getById(user.profileId);
      }

      if ((!profRes?.success || !profRes.data) && user.profileId) {
        profRes = await studentService.getById(user.profileId);
      }
      if (!profRes?.success || !profRes.data) {
        throw new Error(profRes?.message || 'The server returned no student profile.');
      }

      const profileId = profRes.data.id ?? profRes.data._id ?? user.profileId;
      setProfile({ ...profRes.data, id: profileId });
      setProfileLoadError('');

      const allSkillsRes = await adminService.getSkills().catch(() => ({ data: [] }));
      if (allSkillsRes.success && allSkillsRes.data) {
        setSkillsList(allSkillsRes.data);
      }
    } catch (e) {
      console.error(e);
      setProfileLoadError(e.message || 'Unable to load your student profile.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const profileId = profile?.id ?? profile?._id ?? user?.profileId;
    if (!profileId) {
      setMessage('Your student profile could not be loaded. Please refresh and try again.');
      return;
    }

    const updates = {
      bio: profile.bio ?? '',
      linkedinUrl: profile.linkedinUrl ?? '',
      githubUrl: profile.githubUrl ?? '',
      portfolioUrl: profile.portfolioUrl ?? '',
    };
    const cgpaValue = String(profile.cgpa ?? '').trim();
    let skippedCgpa = false;
    if (cgpaValue) {
      const cgpa = Number(cgpaValue);
      if (Number.isFinite(cgpa) && cgpa >= 0 && cgpa <= 10) {
        updates.cgpa = cgpa;
      } else {
        skippedCgpa = true;
      }
    }

    setSaving(true);
    setMessage('');
    try {
      const response = await studentService.updateProfile(profileId, updates);
      if (!response?.success) {
        throw new Error(response?.message || 'The server did not confirm the profile update.');
      }
      setMessage(skippedCgpa
        ? 'Other details saved. CGPA was skipped because it must be between 0 and 10.'
        : 'Profile details updated successfully!');
      setTimeout(() => setMessage(''), 4000);
    } catch (e) {
      setMessage('Failed to update profile: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    const trimmedSkillName = skillName.trim();
    const profileId = profile?.id ?? profile?._id ?? user?.profileId;
    if (addingSkill) return;
    if (!profileId) {
      setSkillError('Your student profile ID is missing. Sign out and sign in again, then retry.');
      return;
    }
    if (!trimmedSkillName) {
      setSkillError('Enter a skill name before adding it.');
      return;
    }

    setAddingSkill(true);
    setSkillError('');
    try {
      const existingSkill = skillsList.find(
        (skill) => skill.name?.toLowerCase() === trimmedSkillName.toLowerCase()
      );
      const response = await studentService.addSkill(
        profileId,
        existingSkill?.id,
        existingSkill ? undefined : trimmedSkillName,
        skillProficiency
      );
      if (!response?.success || !response.data) {
        throw new Error(response?.message || 'The server did not confirm that the skill was added.');
      }
      setProfile((currentProfile) => currentProfile
        ? { ...currentProfile, skills: [...(currentProfile.skills || []), response.data] }
        : currentProfile);
      setShowSkillModal(false);
      setSkillName('');
      await loadData();
    } catch (e) {
      setSkillError(`Could not add skill: ${e.message}`);
    } finally {
      setAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    if (!confirm('Remove this skill?')) return;
    try {
      await studentService.removeSkill(skillId);
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!profile?.id) return;
    try {
      await studentService.addProject(profile.id, projectForm);
      setShowProjectModal(false);
      setProjectForm({ title: '', description: '', technologies: '', repoUrl: '', liveUrl: '' });
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!confirm('Delete this project?')) return;
    try {
      await studentService.deleteProject(projectId);
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleAddCert = async (e) => {
    e.preventDefault();
    if (!profile?.id) return;
    try {
      await studentService.addCertification(profile.id, certForm);
      setShowCertModal(false);
      setCertForm({ title: '', issuingOrganization: '', issueDate: '', certificateUrl: '' });
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeleteCert = async (certId) => {
    if (!confirm('Delete this certification?')) return;
    try {
      await studentService.deleteCertification(certId);
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleAddInternship = async (e) => {
    e.preventDefault();
    if (!profile?.id) return;
    try {
      await studentService.addInternship(profile.id, internshipForm);
      setShowInternshipModal(false);
      setInternshipForm({ companyName: '', roleTitle: '', startDate: '', endDate: '', description: '' });
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDeleteInternship = async (internshipId) => {
    if (!confirm('Delete this internship?')) return;
    try {
      await studentService.deleteInternship(internshipId);
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Student Profile & Portfolio</h1>
          <p className="text-xs text-slate-500">Manage your credentials, technical skills, projects, and career highlights</p>
        </div>
        {message && (
          <div className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold border ${
            message.startsWith('Failed') || message.startsWith('Your student')
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {message.startsWith('Failed') || message.startsWith('Your student')
              ? <AlertCircle className="h-4 w-4" />
              : <CheckCircle2 className="h-4 w-4" />}
            {message}
          </div>
        )}
      </div>
      {profileLoadError && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
          Could not load your student profile: {profileLoadError}
          {!user?.profileId && ' Please sign out and sign back in to refresh your profile details.'}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Personal & Academic Info */}
        <div className="lg:col-span-4 space-y-6">
          {/* Identity Card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-2xl font-black text-white shadow-md">
              {user?.fullName?.charAt(0) || 'S'}
            </div>
            <h2 className="mt-4 text-base font-bold text-slate-800">{user?.fullName}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <div className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
              {profile?.placementStatus || 'ACTIVELY_SEEKING'}
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4 space-y-2 text-left text-xs">
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Roll Number</span>
                <span className="font-bold text-slate-700">{profile?.rollNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Department</span>
                <span className="font-bold text-slate-700">{profile?.department?.name || 'Computer Science'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Current CGPA</span>
                <span className="font-extrabold text-indigo-600">{Number(profile?.cgpa || 8.5).toFixed(2)} / 10.0</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Graduation Batch</span>
                <span className="font-bold text-slate-700">{profile?.batchYear}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Active Backlogs</span>
                <span className="font-bold text-slate-700">{profile?.backlogs || 0}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">10th / 12th Marks</span>
                <span className="font-bold text-slate-700">{profile?.tenthPercentage || 92}% / {profile?.twelfthPercentage || 89}%</span>
              </div>
            </div>
          </div>

          {/* Social & Contact Links */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Links & Profiles</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Linkedin className="h-4 w-4 text-indigo-600 shrink-0" />
                <span className="truncate">{profile?.linkedinUrl || 'Not linked'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Github className="h-4 w-4 text-slate-800 shrink-0" />
                <span className="truncate">{profile?.githubUrl || 'Not linked'}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Globe className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="truncate">{profile?.portfolioUrl || 'Not linked'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Bio, Skills, Projects, Certifications, Internships */}
        <div className="lg:col-span-8 space-y-6">
          {/* Bio & Details Form */}
          <form noValidate onSubmit={handleUpdateProfile} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Professional Summary & Contact</h3>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600">Bio / Career Objective</label>
              <textarea
                rows={3}
                value={profile?.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                placeholder="Aspiring Software Development Engineer with a strong foundation in Data Structures, Algorithms, and Cloud-Native web applications..."
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600">Current CGPA</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={profile?.cgpa ?? ''}
                  onChange={(e) => setProfile({ ...profile, cgpa: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  placeholder="8.50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600">LinkedIn Profile URL</label>
                <input
                  type="text"
                  inputMode="url"
                  value={profile?.linkedinUrl || ''}
                  onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600">GitHub Profile URL</label>
                <input
                  type="text"
                  inputMode="url"
                  value={profile?.githubUrl || ''}
                  onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600">Portfolio Website</label>
                <input
                  type="text"
                  inputMode="url"
                  value={profile?.portfolioUrl || ''}
                  onChange={(e) => setProfile({ ...profile, portfolioUrl: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none"
                  placeholder="https://portfolio.dev"
                />
              </div>
            </div>
          </form>

          {/* Technical Skills Section */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Verified Technical Skills</h3>
                <p className="text-[11px] text-slate-400">Used for recruiter search and AI job matching</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSkillError('');
                  setShowSkillModal(true);
                }}
                className="flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition"
              >
                <Plus className="h-3.5 w-3.5" /> Add Skill
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile?.skills?.length === 0 ? (
                <div className="text-xs text-slate-400">No skills added yet. Add your core programming languages and frameworks!</div>
              ) : (
                profile?.skills?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm"
                  >
                    <span>{item.skill?.name || 'Skill'}</span>
                    <span className="rounded-md bg-indigo-100 px-1.5 py-0.5 text-[10px] font-bold text-indigo-700">
                      {item.proficiencyLevel}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(item.id)}
                      className="text-slate-400 hover:text-rose-500 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Projects Showcase */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Featured Projects</h3>
                <p className="text-[11px] text-slate-400">Highlight your engineering and capstone work</p>
              </div>
              <button
                type="button"
                onClick={() => setShowProjectModal(true)}
                className="flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition"
              >
                <Plus className="h-3.5 w-3.5" /> Add Project
              </button>
            </div>

            <div className="space-y-3">
              {profile?.projects?.length === 0 ? (
                <div className="text-xs text-slate-400">No projects added yet. Showcase your GitHub or semester projects!</div>
              ) : (
                profile?.projects?.map((proj) => (
                  <div key={proj.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{proj.title}</h4>
                        <div className="mt-1 text-[11px] font-medium text-indigo-600">{proj.technologies}</div>
                        <p className="mt-2 text-slate-600 leading-relaxed">{proj.description}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex gap-3 text-xs font-semibold">
                      {proj.repoUrl && (
                        <a href={proj.repoUrl} target="_blank" rel="noreferrer" className="text-slate-700 hover:text-indigo-600 flex items-center gap-1">
                          <Github className="h-3.5 w-3.5" /> Repository
                        </a>
                      )}
                      {proj.liveUrl && (
                        <a href={proj.liveUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                          <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Certifications & Internships */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Certifications */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800">Certifications</h3>
                <button
                  onClick={() => setShowCertModal(true)}
                  className="rounded-lg bg-indigo-50 p-1 text-indigo-600 hover:bg-indigo-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                {profile?.certifications?.map((c) => (
                  <div key={c.id} className="flex justify-between items-center rounded-xl border border-slate-100 p-2.5 bg-slate-50/50">
                    <div>
                      <div className="font-bold text-slate-800">{c.title}</div>
                      <div className="text-[11px] text-slate-500">{c.issuingOrganization} • {c.issueDate}</div>
                    </div>
                    <button onClick={() => handleDeleteCert(c.id)} className="text-slate-400 hover:text-rose-500">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Internships */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800">Work & Internships</h3>
                <button
                  onClick={() => setShowInternshipModal(true)}
                  className="rounded-lg bg-indigo-50 p-1 text-indigo-600 hover:bg-indigo-100"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-2 text-xs">
                {profile?.internships?.map((i) => (
                  <div key={i.id} className="flex justify-between items-center rounded-xl border border-slate-100 p-2.5 bg-slate-50/50">
                    <div>
                      <div className="font-bold text-slate-800">{i.roleTitle} @ {i.companyName}</div>
                      <div className="text-[11px] text-slate-500">{i.startDate} - {i.endDate || 'Present'}</div>
                    </div>
                    <button onClick={() => handleDeleteInternship(i.id)} className="text-slate-400 hover:text-rose-500">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Skill Modal */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Add Technical Skill</h3>
            <form onSubmit={handleAddSkill} className="space-y-3 text-xs">
              <div>
                <label htmlFor="skill-name" className="font-semibold text-slate-600">Skill Name</label>
                <input
                  id="skill-name"
                  list="available-skills"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  placeholder="Type a skill, e.g. Java or React"
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-indigo-500 focus:outline-none"
                />
                <datalist id="available-skills">
                  {skillsList.map((s) => (
                    <option key={s.id} value={s.name}>{s.category}</option>
                  ))}
                </datalist>
              </div>
              <div>
                <label className="font-semibold text-slate-600">Proficiency Level</label>
                <select
                  value={skillProficiency}
                  onChange={(e) => setSkillProficiency(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
              {skillError && (
                <p role="alert" className="rounded-lg bg-rose-50 p-2 text-rose-700">
                  {skillError}
                </p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSkillModal(false);
                    setSkillError('');
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!skillName.trim() || addingSkill}
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {addingSkill ? 'Adding...' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Add Project</h3>
            <form onSubmit={handleAddProject} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600">Project Title</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Distributed E-Commerce Microservices"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600">Technologies Used</label>
                <input
                  type="text"
                  required
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. React, Spring Boot, PostgreSQL, Docker"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600">Description</label>
                <textarea
                  rows={3}
                  required
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 focus:border-indigo-500 focus:outline-none"
                  placeholder="Built microservices architecture supporting 10k RPS..."
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-600">GitHub URL</label>
                  <input
                    type="url"
                    value={projectForm.repoUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, repoUrl: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">Live URL</label>
                  <input
                    type="url"
                    value={projectForm.liveUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                    placeholder="https://demo.app"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Certification Modal */}
      {showCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Add Certification</h3>
            <form onSubmit={handleAddCert} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600">Certificate Title</label>
                <input
                  type="text"
                  required
                  value={certForm.title}
                  onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  placeholder="e.g. AWS Certified Developer Associate"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600">Issuing Organization</label>
                <input
                  type="text"
                  required
                  value={certForm.issuingOrganization}
                  onChange={(e) => setCertForm({ ...certForm, issuingOrganization: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  placeholder="e.g. Amazon Web Services"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600">Issue Date</label>
                <input
                  type="date"
                  required
                  value={certForm.issueDate}
                  onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCertModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Internship Modal */}
      {showInternshipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-800">Add Internship</h3>
            <form onSubmit={handleAddInternship} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600">Company Name</label>
                <input
                  type="text"
                  required
                  value={internshipForm.companyName}
                  onChange={(e) => setInternshipForm({ ...internshipForm, companyName: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  placeholder="e.g. Cisco Systems"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600">Role Title</label>
                <input
                  type="text"
                  required
                  value={internshipForm.roleTitle}
                  onChange={(e) => setInternshipForm({ ...internshipForm, roleTitle: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  placeholder="e.g. Software Engineer Intern"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-600">Start Date</label>
                  <input
                    type="date"
                    required
                    value={internshipForm.startDate}
                    onChange={(e) => setInternshipForm({ ...internshipForm, startDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">End Date</label>
                  <input
                    type="date"
                    value={internshipForm.endDate}
                    onChange={(e) => setInternshipForm({ ...internshipForm, endDate: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInternshipModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;
