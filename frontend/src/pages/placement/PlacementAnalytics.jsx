import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, BarChart3, PieChart as PieIcon, Users } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, CartesianGrid, LineChart, Line 
} from 'recharts';
import { analyticsService } from '../../services/api';

export const PlacementAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await analyticsService.getDashboardStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const departmentData = [
    { name: 'Computer Science', placed: 94, average: 11.2 },
    { name: 'Information Tech', placed: 89, average: 9.8 },
    { name: 'Electronics & Comm', placed: 82, average: 7.9 },
    { name: 'Electrical Engg', placed: 76, average: 6.8 },
    { name: 'Mechanical Engg', placed: 71, average: 6.2 },
  ];

  const yearlyTrends = [
    { year: '2023', rate: 79, offers: 320 },
    { year: '2024', rate: 84, offers: 375 },
    { year: '2025', rate: 86, offers: 405 },
    { year: '2026 (Current)', rate: 89, offers: 430 },
  ];

  const sectorDistribution = [
    { name: 'Software / IT', value: 52, color: '#6366f1' },
    { name: 'Consulting & BFSI', value: 24, color: '#8b5cf6' },
    { name: 'Core Engineering', value: 14, color: '#10b981' },
    { name: 'EdTech & Startups', value: 10, color: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Campus Placement Analytics</h1>
        <p className="text-xs text-slate-500">Visual performance metrics and institutional hiring reports</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Department Placement % & Average CTC */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Placement % by Engineering Department</h3>
            <p className="text-[11px] text-slate-400">Department comparison</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} interval={0} angle={-15} textAnchor="end" height={50} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="placed" name="Placement Rate (%)" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Sector Hiring Breakdown */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Recruiter Industry Sector Distribution</h3>
            <p className="text-[11px] text-slate-400">Share of campus job offers by domain</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sectorDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {sectorDistribution.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600">{s.name}:</span>
                <span className="font-bold text-slate-800">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Year Trend Line Chart */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">4-Year Campus Placement Growth Trend</h3>
            <p className="text-[11px] text-slate-400">Historical placement rate and overall offer counts</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[70, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="rate" name="Placement Rate (%)" stroke="#6366f1" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementAnalytics;
