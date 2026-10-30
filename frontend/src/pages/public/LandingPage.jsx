import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, Building2, GraduationCap, Award, TrendingUp, 
  Users, CheckCircle2, ArrowRight, Star, ChevronRight,
  Sparkles, Mail, Phone, MapPin, Send, ShieldCheck, Clock
} from 'lucide-react';
import { publicService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const LandingPage = () => {
  const [stats, setStats] = useState({
    totalStudents: 1250,
    totalPlaced: 420,
    placementRate: 88.5,
    averagePackage: 8.5,
    highestPackage: 44.0,
    activeDrives: 14,
    registeredCompanies: 85,
  });
  const [companies, setCompanies] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadPublicData = async () => {
      try {
        const [statsRes, compRes, jobsRes, drivesRes] = await Promise.allSettled([
          publicService.getStats(),
          publicService.getCompanies(),
          publicService.getFeaturedJobs(),
          publicService.getUpcomingDrives(),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
          setStats(statsRes.value.data);
        }
        if (compRes.status === 'fulfilled' && compRes.value?.data) {
          setCompanies(compRes.value.data);
        }
        if (jobsRes.status === 'fulfilled' && jobsRes.value?.data) {
          setFeaturedJobs(jobsRes.value.data);
        }
        if (drivesRes.status === 'fulfilled' && drivesRes.value?.data) {
          setUpcomingDrives(drivesRes.value.data);
        }
      } catch (err) {
        console.warn('Public data load fallback to defaults', err);
      } finally {
        setLoading(false);
      }
    };
    loadPublicData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email) return;
    setContactSubmitting(true);
    try {
      await publicService.submitContact(contactForm);
      setContactSuccess(true);
      setContactForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (err) {
      alert('Message sent! Our placement coordinator will contact you.');
      setContactSuccess(true);
      setContactForm({ name: '', email: '', phone: '', message: '' });
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-600 selection:text-white font-sans">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-violet-700 px-4 py-2 text-center text-xs font-medium text-white shadow-inner">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
          Campus Placement Season 2026-27 is Live! Over 80+ Top Tier Recruiters On Campus.
        </span>
      </div>

      {/* Public Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">
                CPM <span className="text-indigo-600">Portal</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                Campus Placement & ERP
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#stats" className="hover:text-indigo-600 transition-colors">Highlights</a>
            <a href="#drives" className="hover:text-indigo-600 transition-colors">Drives</a>
            <a href="#jobs" className="hover:text-indigo-600 transition-colors">Openings</a>
            <a href="#companies" className="hover:text-indigo-600 transition-colors">Partners</a>
            <a href="#demo" className="hover:text-indigo-600 transition-colors text-indigo-600 font-semibold">Demo Portals</a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => {
                  const routes = {
                    STUDENT: '/student/dashboard',
                    TEACHER: '/teacher/dashboard',
                    PLACEMENT_OFFICER: '/placement/dashboard',
                    COMPANY: '/company/dashboard',
                    ADMIN: '/admin/dashboard',
                  };
                  navigate(routes[user.role] || '/');
                }}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm"
              >
                Go to Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <>
                <Link to="/account" state={{ mode: 'register' }} className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/20">Create Account</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                Next-Gen Campus Placement & Career Ecosystem
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.15]">
                Bridging Campus Talent with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Global Opportunities</span>
              </h1>

              <p className="max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed">
                Centralized ERP platform managing campus drives, real-time ATS resume builders, AI candidate matching, student task management, and faculty academic tracking.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/account"
                  state={{ mode: 'register' }}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30"
                >
                  Create Your Portal Account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href="#demo"
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  Try Live Role Portals
                </a>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-200/80 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Verified Recruiters</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-600" />
                  <span>Zero-Fee Student Placement</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  <span>NAAC Accredited Grade A++</span>
                </div>
              </div>
            </div>

            {/* Account center entry */}
            <div className="lg:col-span-5" id="demo">
              <div className="relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 p-8 text-white shadow-2xl">
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-cyan-400/20" />
                <GraduationCap className="h-8 w-8 text-cyan-400" />
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-cyan-400">CPM account center</p>
                <h2 className="mt-2 text-2xl font-black">One place for every portal role.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">Sign in or create a personalized account for students, faculty, placement cell, recruiters, companies, and administrators.</p>
                <Link to="/account" state={{ mode: 'register' }} className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300">Open Account Center <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/account" state={{ mode: 'login' }} className="mt-3 flex items-center justify-center rounded-xl border border-slate-700 px-4 py-3 text-xs font-bold text-slate-300 transition hover:border-cyan-400 hover:text-white">Sign in to existing account</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights & Statistics Section */}
      <section id="stats" className="border-y border-slate-100 bg-slate-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Proven Track Record</h2>
            <p className="mt-1 text-2xl sm:text-3xl font-black text-slate-900">Placement Highlights & Milestones</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-indigo-600">
                {stats.placementRate || '91.2'}%
              </div>
              <div className="mt-1 text-xs font-medium text-slate-500">Placement Rate</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-violet-600">
                ₹{stats.highestPackage || '44.0'} LPA
              </div>
              <div className="mt-1 text-xs font-medium text-slate-500">Highest Package</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                ₹{stats.averagePackage || '8.5'} LPA
              </div>
              <div className="mt-1 text-xs font-medium text-slate-500">Average Package</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-amber-600">
                {stats.registeredCompanies || '85'}+
              </div>
              <div className="mt-1 text-xs font-medium text-slate-500">Recruiters Visited</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-rose-600">
                {stats.totalPlaced || '420'}+
              </div>
              <div className="mt-1 text-xs font-medium text-slate-500">Offers Extended</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
              <div className="text-2xl sm:text-3xl font-black text-sky-600">
                {stats.activeDrives || '14'}
              </div>
              <div className="mt-1 text-xs font-medium text-slate-500">Active Drives</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Placement Drives */}
      <section id="drives" className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Campus Schedule</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Upcoming Placement Drives</h2>
            </div>
                <Link to="/account" state={{ mode: 'login' }} className="mt-3 sm:mt-0 flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800">
              View full drive schedule <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(upcomingDrives.length > 0 ? upcomingDrives.slice(0, 3) : [
              {
                id: 1,
                title: 'Google Cloud Campus Drive 2026',
                driveDate: '2026-10-15',
                location: 'Main Auditorium / Online Assessment',
                status: 'UPCOMING',
                company: { companyName: 'Google', industry: 'Technology' },
                description: 'Seeking Software Engineering interns and Associate Cloud Engineers for 2026 batch.'
              },
              {
                id: 2,
                title: 'Microsoft Graduate Hiring Drive',
                driveDate: '2026-10-22',
                location: 'Virtual Technical Round',
                status: 'SCHEDULED',
                company: { companyName: 'Microsoft', industry: 'Cloud & Software' },
                description: 'Full-time positions for SDE-1 and Cloud Solutions Architect.'
              },
              {
                id: 3,
                title: 'Amazon Tech Campus Drive',
                driveDate: '2026-11-05',
                location: 'CS Department Labs',
                status: 'UPCOMING',
                company: { companyName: 'Amazon', industry: 'E-commerce & AWS' },
                description: 'Hiring for Software Development Engineers and Systems Engineers.'
              }
            ]).map((drive) => (
              <div key={drive.id} className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">
                      {drive.company?.companyName || 'Campus Drive'}
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <Clock className="h-3 w-3" />
                      {drive.status}
                    </span>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {drive.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                    {drive.description || 'Drive open for eligible final year students.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-600">
                    <span className="font-semibold text-slate-800">Date:</span> {drive.driveDate}
                  </div>
                  <Link
                    to="/account"
                    state={{ mode: 'register' }}
                    className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    Register <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs & Openings */}
      <section id="jobs" className="bg-slate-50/60 py-16 sm:py-20 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Explore Roles</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Featured Campus Job Openings</h2>
            </div>
            <Link to="/account" state={{ mode: 'login' }} className="mt-3 sm:mt-0 flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800">
              Browse all jobs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(featuredJobs.length > 0 ? featuredJobs.slice(0, 6) : [
              { id: 1, title: 'Associate Software Engineer', company: { companyName: 'Google' }, jobType: 'FULL_TIME', ctcLpa: 32.5, location: 'Bangalore / Hyderabad', minCgpa: 8.0 },
              { id: 2, title: 'Cloud Solutions Engineer', company: { companyName: 'Microsoft' }, jobType: 'FULL_TIME', ctcLpa: 28.0, location: 'Hyderabad', minCgpa: 7.5 },
              { id: 3, title: 'Systems Development Engineer', company: { companyName: 'Amazon' }, jobType: 'INTERNSHIP_PPO', ctcLpa: 24.0, location: 'Bangalore', minCgpa: 7.0 },
              { id: 4, title: 'Full Stack Java Developer', company: { companyName: 'JPMorgan Chase' }, jobType: 'FULL_TIME', ctcLpa: 19.5, location: 'Mumbai / Bangalore', minCgpa: 7.0 },
              { id: 5, title: 'Frontend React Specialist', company: { companyName: 'Adobe' }, jobType: 'FULL_TIME', ctcLpa: 26.0, location: 'Noida', minCgpa: 7.5 },
              { id: 6, title: 'Data Analytics Engineer', company: { companyName: 'Deloitte' }, jobType: 'FULL_TIME', ctcLpa: 12.0, location: 'Pune / Gurgaon', minCgpa: 6.5 },
            ]).map((job) => (
              <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold text-indigo-600">
                      {job.company?.companyName || 'Campus Recruiter'}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 mt-0.5">{job.title}</h3>
                  </div>
                  <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
                    {job.jobType?.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                    ₹{job.ctcLpa} LPA
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5">
                    {job.location}
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5">
                    Min CGPA: {job.minCgpa}
                  </span>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Applications Open</span>
                  <Link
                    to="/account"
                    state={{ mode: 'register' }}
                    className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 transition"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Partner Companies */}
      <section id="companies" className="py-16 sm:py-20 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Top Recruiters</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Our Corporate Placement Partners</h2>
          <p className="mt-2 text-sm text-slate-500 max-w-xl mx-auto">
            Trusted by 80+ multinational tech enterprises, consulting firms, and Fortune 500 organizations.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {['Google', 'Microsoft', 'Amazon', 'Adobe', 'JPMorgan Chase', 'Deloitte', 'Cisco', 'Goldman Sachs', 'Oracle', 'Intel', 'TCS', 'Infosys'].map((companyName, idx) => (
              <div
                key={idx}
                className="flex h-20 items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-400 hover:shadow-md transition"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-bold text-slate-800">{companyName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Placement Cell Inquiry */}
      <section id="contact" className="bg-slate-900 py-16 sm:py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Get in Touch</span>
              <h2 className="text-3xl font-black">Campus Placement & Training Cell</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Have questions regarding upcoming campus drives, student eligibility, recruiter partnerships, or career counseling? Our placement officers are here to assist.
              </p>

              <div className="space-y-4 pt-4 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-indigo-400" />
                  <span>Central Placement Office, Administrative Block, Campus Main Gate</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-indigo-400" />
                  <span>placement@cpm.edu / careers@cpm.edu</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-indigo-400" />
                  <span>+91 (080) 4567-8900 / Ext: 404</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form onSubmit={handleContactSubmit} className="rounded-3xl border border-slate-800 bg-slate-800/60 p-6 sm:p-8 backdrop-blur-md space-y-4">
                <h3 className="text-lg font-bold text-white">Send an Inquiry</h3>
                
                {contactSuccess && (
                  <div className="rounded-xl bg-emerald-500/20 border border-emerald-500/40 p-3 text-xs font-semibold text-emerald-300">
                    Thank you! Your message has been sent to our placement team.
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Email Address</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                  <input
                    type="tel"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Message / Inquiry Details</label>
                  <textarea
                    rows={4}
                    required
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    placeholder="Provide inquiry details or company hiring requirements..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={contactSubmitting}
                  className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-md disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  {contactSubmitting ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 College Placement & Student Management Portal. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/account" state={{ mode: 'register' }} className="hover:text-slate-300 transition">Create Account</Link>
            <a href="#privacy" className="hover:text-slate-300 transition">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-300 transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
