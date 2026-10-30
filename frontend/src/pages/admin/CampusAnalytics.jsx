import React, { useState, useEffect } from 'react';
import { TrendingUp, BarChart3, PieChart as PieIcon, Award } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, CartesianGrid 
} from 'recharts';
import { analyticsService } from '../../services/api';

export const CampusAnalytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    analyticsService.getDashboardStats().then(res => {
      if (res.success) setStats(res.data);
    }).catch(console.error);
  }, []);

  const branchData = [
    { name: 'Computer Science', rate: 94 },
    { name: 'Information Tech', rate: 89 },
    { name: 'Electronics & Comm', rate: 82 },
    { name: 'Electrical Engg', rate: 76 },
    { name: 'Mechanical Engg', rate: 71 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800">Campus Macro Analytics</h1>
        <p className="text-xs text-slate-500">University accreditation, placement ratios, and cross-departmental hiring trends</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Branch-wise Placement Clearance %</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branchData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="rate" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CampusAnalytics;
