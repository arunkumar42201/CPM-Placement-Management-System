import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, Search, User, LogOut, Menu, X, ChevronDown,
  CheckCircle2, Briefcase, Calendar, ShieldCheck,
  Layers, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'PLACEMENT_OFFICER': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'COMPANY':
      case 'RECRUITER': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'TEACHER': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    }
  };

  return (
    <header className="portal-navbar sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md transition-all sm:px-6">
      {/* Left side: Hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden focus:outline-none"
        >
          <Menu className="h-5 w-5" />
        </button>

        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 leading-tight">
              CPM <span className="text-indigo-600">Portal</span>
            </span>
            <span className="text-[10px] font-medium text-slate-500">Placement & ERP System</span>
          </div>
        </Link>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs, placement drives, students, skills..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 py-2 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Right side: Notifications and Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 z-50 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-slate-800">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">No notifications yet</div>
                ) : (
                  notifications.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markAsRead(item.id)}
                      className={`flex flex-col gap-1 p-3 text-xs transition-colors hover:bg-slate-50 cursor-pointer ${
                        !item.isRead ? 'bg-indigo-50/40 font-medium' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{item.title}</span>
                        {!item.isRead && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                      </div>
                      <p className="text-slate-600 line-clamp-2">{item.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Popover */}
        <div className="relative">
          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            className="flex items-center gap-2 rounded-xl p-1 text-left hover:bg-slate-100 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-indigo-600 text-white font-semibold text-xs ring-2 ring-indigo-500/20">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.fullName} className="h-full w-full object-cover" />
              ) : (
                user?.fullName?.charAt(0) || 'U'
              )}
            </div>
            <div className="hidden lg:flex flex-col">
              <span className="text-xs font-semibold text-slate-800 leading-none">{user?.fullName || 'User'}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">{user?.role?.replace('_', ' ')}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden lg:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl ring-1 ring-black/5 z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{user?.fullName}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <div className={`mt-1.5 inline-block rounded-md border px-2 py-0.5 text-[10px] font-semibold ${getRoleBadgeColor(user?.role)}`}>
                  {user?.role}
                </div>
              </div>

              <div className="py-1">
                <Link
                  to={user?.role === 'STUDENT' ? '/student/profile' : '#'}
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <User className="h-4 w-4 text-slate-400" />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
