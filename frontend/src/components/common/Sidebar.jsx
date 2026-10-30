import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, User, FileText, Award, FolderGit2,
  Briefcase, Calendar, CheckSquare, GraduationCap,
  Users, Building2, TrendingUp, Bell, Megaphone,
  Settings, HelpCircle, FileCheck, BookOpen, PlusCircle,
  Search, ShieldAlert, BookMarked, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();

  const getRoleNavItems = () => {
    switch (user?.role) {
      case 'STUDENT':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { name: 'My Profile', path: '/student/profile', icon: User },
          { name: 'Resume Builder', path: '/student/resume-builder', icon: FileText, badge: 'Pro' },
          { name: 'AI Mock Interview', path: '/student/mock-interview', icon: Sparkles, badge: 'AI' },
          { name: 'Jobs & Openings', path: '/student/jobs', icon: Briefcase },
          { name: 'Placement Drives', path: '/student/drives', icon: Calendar },
          { name: 'My Applications', path: '/student/applications', icon: FileCheck },
          { name: 'Interviews', path: '/student/interviews', icon: Users },
          { name: 'Daily Activities', path: '/student/daily-tasks', icon: CheckSquare },
          { name: 'Academics & Resources', path: '/student/academics', icon: GraduationCap },
          { name: 'Announcements', path: '/student/announcements', icon: Megaphone },
        ];
      case 'PLACEMENT_OFFICER':
        return [
          { name: 'Dashboard', path: '/placement/dashboard', icon: LayoutDashboard },
          { name: 'Students Directory', path: '/placement/students', icon: GraduationCap },
          { name: 'Partner Companies', path: '/placement/companies', icon: Building2 },
          { name: 'Placement Drives', path: '/placement/drives', icon: Calendar },
          { name: 'Jobs Management', path: '/placement/jobs', icon: Briefcase },
          { name: 'Applications Review', path: '/placement/applications', icon: FileCheck },
          { name: 'Interviews Coordination', path: '/placement/interviews', icon: Users },
          { name: 'Placement Results', path: '/placement/results', icon: Award },
          { name: 'Analytics & Reports', path: '/placement/analytics', icon: TrendingUp },
          { name: 'Announcements', path: '/placement/announcements', icon: Megaphone },
        ];
      case 'COMPANY':
      case 'RECRUITER':
        return [
          { name: 'Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
          { name: 'Company Profile', path: '/company/profile', icon: Building2 },
          { name: 'Candidate Search', path: '/company/candidate-search', icon: Search, badge: 'Match AI' },
          { name: 'Post New Job', path: '/company/jobs/new', icon: PlusCircle },
          { name: 'Manage Jobs', path: '/company/jobs', icon: Briefcase },
          { name: 'Applications', path: '/company/applications', icon: FileCheck },
          { name: 'Interviews', path: '/company/interviews', icon: Users },
        ];
      case 'TEACHER':
        return [
          { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
          { name: 'My Students', path: '/teacher/students', icon: GraduationCap },
          { name: 'Daily Attendance', path: '/teacher/attendance', icon: CheckSquare },
          { name: 'Assignments', path: '/teacher/assignments', icon: BookMarked },
          { name: 'Study Materials', path: '/teacher/study-material', icon: BookOpen },
          { name: 'Placement Prep Tips', path: '/teacher/placement-prep', icon: Award },
          { name: 'Announcements', path: '/teacher/announcements', icon: Megaphone },
        ];
      case 'ADMIN':
        return [
          { name: 'System Overview', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'User Management', path: '/admin/users', icon: Users },
          { name: 'Departments & Batches', path: '/admin/departments', icon: GraduationCap },
          { name: 'Companies & Recruiters', path: '/admin/companies', icon: Building2 },
          { name: 'Job Approvals', path: '/admin/jobs', icon: Briefcase },
          { name: 'Placement Drives', path: '/admin/drives', icon: Calendar },
          { name: 'Campus Analytics', path: '/admin/analytics', icon: TrendingUp },
          { name: 'Announcements', path: '/admin/announcements', icon: Megaphone },
          { name: 'System Settings', path: '/admin/settings', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navItems = getRoleNavItems();

  return (
    <aside
      className={`portal-sidebar fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}
    >
      {/* Mobile Close Button */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25">
            CPM
          </div>
          <span className="font-bold text-slate-800">Menu</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          ✕
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
              className={`portal-nav-item group flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                isActive
                  ? 'active bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Role Footer Badge & Quick Info */}
      <div className="border-t border-slate-100 p-4 bg-slate-50/50">
        <div className="portal-status-card rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
              {user?.role?.replace('_', ' ')}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 truncate">{user?.fullName}</p>
          <div className="mt-2 text-[10px] text-slate-400">Connected to Spring Boot API</div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
