import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public & Auth Pages
import LandingPage from './pages/public/LandingPage';
import AccountPage from './pages/auth/AccountPage';

// Student Portal Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import ResumeBuilder from './pages/student/ResumeBuilder';
import MockInterview from './pages/student/MockInterview';
import StudentJobs from './pages/student/StudentJobs';
import StudentDrives from './pages/student/StudentDrives';
import StudentApplications from './pages/student/StudentApplications';
import StudentInterviews from './pages/student/StudentInterviews';
import DailyTasks from './pages/student/DailyTasks';
import AcademicsResources from './pages/student/AcademicsResources';
import StudentAnnouncements from './pages/student/StudentAnnouncements';
import AiAssistantModal from './components/common/AiAssistantModal';

// Placement Cell Portal Pages
import PlacementDashboard from './pages/placement/PlacementDashboard';
import StudentsDirectory from './pages/placement/StudentsDirectory';
import CompaniesManagement from './pages/placement/CompaniesManagement';
import DrivesManagement from './pages/placement/DrivesManagement';
import PlacementJobs from './pages/placement/PlacementJobs';
import ApplicationsReview from './pages/placement/ApplicationsReview';
import InterviewsCoordination from './pages/placement/InterviewsCoordination';
import PlacementResults from './pages/placement/PlacementResults';
import PlacementAnalytics from './pages/placement/PlacementAnalytics';
import PlacementAnnouncements from './pages/placement/PlacementAnnouncements';

// Company / Recruiter Portal Pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import CompanyProfile from './pages/company/CompanyProfile';
import CandidateSearch from './pages/company/CandidateSearch';
import PostJob from './pages/company/PostJob';
import CompanyJobs from './pages/company/CompanyJobs';
import CompanyApplications from './pages/company/CompanyApplications';
import CompanyInterviews from './pages/company/CompanyInterviews';

// Teacher / Faculty Portal Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherStudents from './pages/teacher/TeacherStudents';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import TeacherAssignments from './pages/teacher/TeacherAssignments';
import TeacherStudyMaterial from './pages/teacher/TeacherStudyMaterial';
import TeacherPlacementPrep from './pages/teacher/TeacherPlacementPrep';
import TeacherAnnouncements from './pages/teacher/TeacherAnnouncements';

// Admin Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import DepartmentsBatches from './pages/admin/DepartmentsBatches';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminJobs from './pages/admin/AdminJobs';
import CampusAnalytics from './pages/admin/CampusAnalytics';
import SystemSettings from './pages/admin/SystemSettings';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/account" element={<AccountPage />} />

            {/* Student Protected Portal */}
            <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/profile" element={<StudentProfile />} />
                <Route path="/student/resume-builder" element={<ResumeBuilder />} />
                <Route path="/student/mock-interview" element={<MockInterview />} />
                <Route path="/student/jobs" element={<StudentJobs />} />
                <Route path="/student/drives" element={<StudentDrives />} />
                <Route path="/student/applications" element={<StudentApplications />} />
                <Route path="/student/interviews" element={<StudentInterviews />} />
                <Route path="/student/daily-tasks" element={<DailyTasks />} />
                <Route path="/student/academics" element={<AcademicsResources />} />
                <Route path="/student/announcements" element={<StudentAnnouncements />} />
              </Route>
            </Route>

            {/* Placement Officer Protected Portal */}
            <Route element={<ProtectedRoute allowedRoles={['PLACEMENT_OFFICER']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/placement/dashboard" element={<PlacementDashboard />} />
                <Route path="/placement/students" element={<StudentsDirectory />} />
                <Route path="/placement/companies" element={<CompaniesManagement />} />
                <Route path="/placement/drives" element={<DrivesManagement />} />
                <Route path="/placement/jobs" element={<PlacementJobs />} />
                <Route path="/placement/applications" element={<ApplicationsReview />} />
                <Route path="/placement/interviews" element={<InterviewsCoordination />} />
                <Route path="/placement/results" element={<PlacementResults />} />
                <Route path="/placement/analytics" element={<PlacementAnalytics />} />
                <Route path="/placement/announcements" element={<PlacementAnnouncements />} />
              </Route>
            </Route>

            {/* Company / Recruiter Protected Portal */}
            <Route element={<ProtectedRoute allowedRoles={['COMPANY', 'RECRUITER']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/company/dashboard" element={<CompanyDashboard />} />
                <Route path="/company/profile" element={<CompanyProfile />} />
                <Route path="/company/candidate-search" element={<CandidateSearch />} />
                <Route path="/company/jobs/new" element={<PostJob />} />
                <Route path="/company/jobs" element={<CompanyJobs />} />
                <Route path="/company/applications" element={<CompanyApplications />} />
                <Route path="/company/interviews" element={<CompanyInterviews />} />
              </Route>
            </Route>

            {/* Teacher Protected Portal */}
            <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/students" element={<TeacherStudents />} />
                <Route path="/teacher/attendance" element={<TeacherAttendance />} />
                <Route path="/teacher/assignments" element={<TeacherAssignments />} />
                <Route path="/teacher/study-material" element={<TeacherStudyMaterial />} />
                <Route path="/teacher/placement-prep" element={<TeacherPlacementPrep />} />
                <Route path="/teacher/announcements" element={<TeacherAnnouncements />} />
              </Route>
            </Route>

            {/* Administrator Protected Portal */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/departments" element={<DepartmentsBatches />} />
                <Route path="/admin/companies" element={<AdminCompanies />} />
                <Route path="/admin/jobs" element={<AdminJobs />} />
                <Route path="/admin/drives" element={<DrivesManagement />} />
                <Route path="/admin/analytics" element={<CampusAnalytics />} />
                <Route path="/admin/announcements" element={<PlacementAnnouncements />} />
                <Route path="/admin/settings" element={<SystemSettings />} />
              </Route>
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {/* Global AI Floating Copilot Modal */}
          <AiAssistantModal />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
