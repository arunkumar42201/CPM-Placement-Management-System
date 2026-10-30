import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, TrendingUp, Users, Building2, Calendar, Briefcase, 
  ArrowRight, PlusCircle, CheckCircle2, ChevronRight, Sparkles 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, CartesianGrid 
} from 'recharts';
import { 
  analyticsService, placementCellService, placementDriveService, jobService 
} from '../../services/api';

export const PlacementDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 1250,
    totalPlaced: 420,
    placementRate: 88.5,
    averagePackage: 8.5,
    highestPackage: 44.0,
    activeDrives: 14,
    registeredCompanies: 85,
    branchStats: [
      { branch: 'CSE', placed: 94, total: 100 },
      { branch: 'IT', placed: 88, total: 100 },
      { branch: 'ECE', placed: 82, total: 100 },
      { branch: 'EE', placed: 75, total: 100 },
      { branch: 'ME', placed: 68, total: 100 },
    ]
  });
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlacementData = async () => {
      try {
        const [statsRes, drivesRes, compsRes] = await Promise.allSettled([
          analyticsService.getDashboardStats(),
          placementDriveService.getAll(),
          placementCellService.getCompanies(),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
          setStats((prev) => ({ ...prev, ...statsRes.value.data }));
        }
        if (drivesRes.status === 'fulfilled' && drivesRes.value?.data) {
          setDrives(drivesRes.value.data);
        }
        if (compsRes.status === 'fulfilled' && compsRes.value?.data) {
          setCompanies(compsRes.value.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadPlacementData();
  }, []);

  const chartData = [
    { name: 'CSE', rate: 94 },
    { name: 'IT', rate: 89 },
    { name: 'ECE', rate: 82 },
    { name: 'EE', rate: 76 },
    { name: 'MECH', rate: 71 },
  ];

  const salaryDistribution = [
    { name: '< 6 LPA', value: 120, color: '#94a3b8' },
    { name: '6 - 12 LPA', value: 210, color: '#6366f1' },
    { name: '12 - 25 LPA', value: 160, color: '#8b5cf6' },
    { name: '25+ LPA (Dream)', value: 45, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-800">Placement Cell Executive Center</h1>
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
              Session 2026
            </span>
          </div>
          <p className="text-xs text-slate-500">Master operations dashboard for campus recruitment drives, student eligibility, and company relations</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/placement/drives"
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/25 hover:bg-indigo-700 transition"
          >
            <PlusCircle className="h-4 w-4" />
            Create Placement Drive
          </Link>
          <Link
            to="/placement/students"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
          >
            <Users className="h-4 w-4" />
            Students Directory
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Placement Rate</span>
          <div className="mt-1 text-2xl font-black text-indigo-600">{stats.placementRate || '88.5'}%</div>
          <div className="mt-1 text-[10px] text-emerald-600 font-semibold">+6.2% vs last year</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Total Placed</span>
          <div className="mt-1 text-2xl font-black text-slate-800">{stats.totalPlaced || '420'}</div>
          <div className="mt-1 text-[10px] text-slate-500">Out of {stats.totalStudents || '1250'}</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Average Package</span>
          <div className="mt-1 text-2xl font-black text-emerald-600">₹{stats.averagePackage || '8.5'} LPA</div>
          <div className="mt-1 text-[10px] text-slate-500">Median: ₹7.8 LPA</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Highest CTC</span>
          <div className="mt-1 text-2xl font-black text-violet-600">₹{stats.highestPackage || '44.0'} LPA</div>
          <div className="mt-1 text-[10px] text-slate-500">Google India</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Active Drives</span>
          <div className="mt-1 text-2xl font-black text-amber-600">{drives.length || stats.activeDrives || '14'}</div>
          <div className="mt-1 text-[10px] text-slate-500">This Month</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold text-slate-400">Partner Companies</span>
          <div className="mt-1 text-2xl font-black text-rose-600">{companies.length || stats.registeredCompanies || '85'}</div>
          <div className="mt-1 text-[10px] text-slate-500">Verified Recruiters</div>
        </div>
      </div>

      {/* Analytics Visualizations Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Branch-wise Placement Rate Bar Chart */}
        <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Branch-wise Placement %</h3>
              <p className="text-[11px] text-slate-400">Percentage of eligible students placed by engineering branch</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="rate" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Salary Tier Distribution Pie Chart */}
        <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Salary Package Distribution</h3>
              <p className="text-[11px] text-slate-400">Breakdown of offers by CTC brackets</p>
            </div>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salaryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {salaryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px]">
            {salaryDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600">{item.name}:</span>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ongoing Drives & Company Approvals */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Drives Board */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Upcoming Placement Drives</h3>
            <Link to="/placement/drives" className="text-xs font-bold text-indigo-600">Manage All</Link>
          </div>

          <div className="space-y-3">
            {(drives.length > 0 ? drives.slice(0, 4) : [
              { id: 1, title: 'Google Campus Drive', driveDate: '2026-10-15', status: 'UPCOMING' },
              { id: 2, title: 'Microsoft SDE Hiring', driveDate: '2026-10-22', status: 'SCHEDULED' },
              { id: 3, title: 'Amazon AWS Drive', driveDate: '2026-11-05', status: 'UPCOMING' },
            ]).map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs">
                <div>
                  <div className="font-bold text-slate-800">{d.title}</div>
                  <div className="text-slate-500">Date: {d.driveDate}</div>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Company Overview */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Recruiting Partners</h3>
            <Link to="/placement/companies" className="text-xs font-bold text-indigo-600">Directory</Link>
          </div>

          <div className="space-y-3">
            {(companies.length > 0 ? companies.slice(0, 4) : [
              { id: 1, companyName: 'Google', industry: 'Cloud & Search', isApproved: true },
              { id: 2, companyName: 'Microsoft', industry: 'Enterprise Software', isApproved: true },
              { id: 3, companyName: 'Amazon', industry: 'Cloud & E-Commerce', isApproved: true },
            ]).map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-xs">
                <div>
                  <div className="font-bold text-slate-800">{c.companyName}</div>
                  <div className="text-slate-500">{c.industry}</div>
                </div>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                  Approved
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementDashboard;
