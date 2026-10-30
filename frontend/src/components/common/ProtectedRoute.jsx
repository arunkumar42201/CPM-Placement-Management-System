import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-500">Loading CPM Platform...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect user to their own valid dashboard
    const defaultRoute = {
      STUDENT: '/student/dashboard',
      TEACHER: '/teacher/dashboard',
      PLACEMENT_OFFICER: '/placement/dashboard',
      COMPANY: '/company/dashboard',
      RECRUITER: '/company/dashboard',
      ADMIN: '/admin/dashboard',
    }[user.role] || '/';

    return <Navigate to={defaultRoute} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
