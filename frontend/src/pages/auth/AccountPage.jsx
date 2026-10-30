import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Briefcase, CheckCircle2, GraduationCap, Lock, Mail, Phone, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const roles = [
  ['STUDENT', 'Student'],
  ['TEACHER', 'Faculty'],
  ['PLACEMENT_OFFICER', 'Placement Cell'],
  ['COMPANY', 'Recruiter / Company'],
  ['ADMIN', 'Admin'],
];

const inputClassName = 'w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15';

const destinationFor = (role) => ({
  STUDENT: '/student/dashboard',
  TEACHER: '/teacher/dashboard',
  PLACEMENT_OFFICER: '/placement/dashboard',
  COMPANY: '/company/dashboard',
  RECRUITER: '/company/dashboard',
  ADMIN: '/admin/dashboard',
}[role] || '/');

const getSavedLoginDetails = () => {
  try {
    const raw = localStorage.getItem('cpm_saved_login');
    if (!raw) return { email: '', password: '' };
    const parsed = JSON.parse(raw);
    return {
      email: parsed?.email || '',
      password: parsed?.password || '',
    };
  } catch (error) {
    return { email: '', password: '' };
  }
};

export const AccountPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState(location.state?.mode === 'login' ? 'login' : 'register');
  const [role, setRole] = useState('STUDENT');
  const savedLogin = getSavedLoginDetails();
  const [form, setForm] = useState({
    fullName: '', email: savedLogin.email, password: savedLogin.password, phone: '', rollNumber: '', departmentId: 1, cgpa: '',
    employeeId: '', designation: '', qualification: '', companyName: '', industry: 'Information Technology',
    location: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const selectMode = (nextMode) => { setMode(nextMode); setError(''); };

  const persistLoginDetails = (email, password) => {
    localStorage.setItem('cpm_saved_login', JSON.stringify({
      email: email?.trim() || '',
      password: password || '',
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      persistLoginDetails(form.email, form.password);
      navigate(location.state?.from?.pathname || destinationFor(user.role), { replace: true });
    } catch (submissionError) {
      setError(submissionError.message || 'Unable to sign in with these details.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...form, role };
      if (role === 'STUDENT') {
        payload.departmentId = Number(payload.departmentId);
        payload.enrollmentNumber = `ENR${payload.rollNumber}`;
        payload.batchYear = 2026;
        payload.cgpa = Number(payload.cgpa);
      }
      if (role === 'TEACHER') payload.experienceYears = 0;
      const user = await register(payload);
      persistLoginDetails(payload.email, payload.password);
      navigate(destinationFor(user.role), { replace: true });
    } catch (submissionError) {
      setError(submissionError.message || 'Registration failed. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="student-register-page min-h-screen overflow-hidden bg-slate-950 px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="student-register-orb student-register-orb-one" />
      <div className="student-register-orb student-register-orb-two" />
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/90 shadow-2xl shadow-cyan-950/30 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="hidden border-r border-slate-800 bg-gradient-to-br from-cyan-950/50 via-slate-950 to-indigo-950/50 p-10 lg:flex lg:flex-col lg:justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950"><Briefcase className="h-6 w-6" /></div>
              <div><div className="text-xl font-black">CPM Portal</div><div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Account center</div></div>
            </Link>
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.24em] text-cyan-400">One portal, every role</p>
              <h1 className="max-w-sm text-4xl font-black leading-tight">Your campus network starts here.</h1>
              <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">Use the account center to sign in or create a personalized profile for your role.</p>
              <div className="mt-8 space-y-3 text-sm text-slate-300">
                {['Student career tools', 'Faculty and placement workflows', 'Recruiter and admin workspaces'].map((item) => <div key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-cyan-400" />{item}</div>)}
              </div>
            </div>
            <p className="text-xs text-slate-600">CPM Campus Placement Management</p>
          </section>

          <section className="p-6 sm:p-10">
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400 lg:hidden"><GraduationCap className="h-5 w-5" /></div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">CPM account center</p>
                <h2 className="mt-2 text-2xl font-black sm:text-3xl">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2>
                <p className="mt-2 text-sm text-slate-400">{mode === 'login' ? 'Access your personalized portal workspace.' : 'Choose your role to see the right registration details.'}</p>
              </div>
              <Link to="/" className="shrink-0 text-xs font-bold text-slate-400 transition hover:text-cyan-400">Back home</Link>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-900 p-1">
              <button type="button" onClick={() => selectMode('login')} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${mode === 'login' ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Sign In</button>
              <button type="button" onClick={() => selectMode('register')} className={`rounded-lg px-3 py-2 text-xs font-bold transition ${mode === 'register' ? 'bg-cyan-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}>Register</button>
            </div>

            {error && <div className="mb-5 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-xs text-rose-300"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{error}</div>}

            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <label className="block text-xs font-bold text-slate-300">Email address<div className="relative mt-1.5"><Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="you@cpm.edu" className={`${inputClassName} pl-10`} /></div></label>
                <label className="block text-xs font-bold text-slate-300">Password<div className="relative mt-1.5"><Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input required type="password" value={form.password} onChange={(event) => update('password', event.target.value)} placeholder="Your password" className={`${inputClassName} pl-10`} /></div></label>
                <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3.5 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60">{submitting ? 'Signing in...' : 'Sign In'}<ArrowRight className="h-4 w-4" /></button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="flex flex-wrap gap-1.5">{roles.map(([value, label]) => <button key={value} type="button" onClick={() => setRole(value)} className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition ${role === value ? 'bg-cyan-400 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>{label}</button>)}</div>
                <label className="block text-xs font-bold text-slate-300">Full name<div className="relative mt-1.5"><User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input required value={form.fullName} onChange={(event) => update('fullName', event.target.value)} placeholder="Full name" className={`${inputClassName} pl-10`} /></div></label>
                <div className="grid gap-3 sm:grid-cols-2"><label className="block text-xs font-bold text-slate-300">Email<input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="you@college.edu" className={`${inputClassName} mt-1.5`} /></label><label className="block text-xs font-bold text-slate-300">Phone<input required value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="Phone number" className={`${inputClassName} mt-1.5`} /></label></div>
                {role === 'STUDENT' && <div className="grid gap-3 sm:grid-cols-3"><input required value={form.rollNumber} onChange={(event) => update('rollNumber', event.target.value)} placeholder="Roll number" className={inputClassName} /><select value={form.departmentId} onChange={(event) => update('departmentId', event.target.value)} className={inputClassName}><option value="1">Computer Science</option><option value="2">Electronics</option><option value="3">Information Technology</option></select><input required type="number" min="0" max="10" step="0.01" value={form.cgpa} onChange={(event) => update('cgpa', event.target.value)} placeholder="CGPA (0-10)" className={inputClassName} /></div>}
                {(role === 'TEACHER' || role === 'PLACEMENT_OFFICER') && <div className="grid gap-3 sm:grid-cols-2"><input value={form.employeeId} onChange={(event) => update('employeeId', event.target.value)} placeholder="Employee ID" className={inputClassName} /><input required value={form.designation} onChange={(event) => update('designation', event.target.value)} placeholder="Designation" className={inputClassName} /></div>}
                {(role === 'COMPANY' || role === 'RECRUITER') && <div className="grid gap-3 sm:grid-cols-2"><input required value={form.companyName} onChange={(event) => update('companyName', event.target.value)} placeholder="Company name" className={inputClassName} /><input value={form.industry} onChange={(event) => update('industry', event.target.value)} placeholder="Industry" className={inputClassName} /></div>}
                <label className="block text-xs font-bold text-slate-300">Password<div className="relative mt-1.5"><Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" /><input required minLength="6" type="password" value={form.password} onChange={(event) => update('password', event.target.value)} placeholder="At least 6 characters" className={`${inputClassName} pl-10`} /></div></label>
                <button type="submit" disabled={submitting} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3.5 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:opacity-60">{submitting ? 'Creating account...' : `Register as ${roles.find(([value]) => value === role)?.[1]}`}<ArrowRight className="h-4 w-4" /></button>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default AccountPage;
