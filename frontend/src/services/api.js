import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cpm_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('cpm_token');
      localStorage.removeItem('cpm_user');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

export const studentService = {
  getAll: () => api.get('/students'),
  getById: (id) => api.get(`/students/${id}`),
  getByUserId: (userId) => api.get(`/students/user/${userId}`),
  getAttendance: (studentId) => api.get(`/students/${studentId}/attendance`),
  getDepartmentAssignments: (studentId) => api.get(`/students/${studentId}/assignments`),
  getStudyMaterials: (studentId) => api.get(`/students/${studentId}/study-materials`),
  getSubmissions: (studentId) => api.get(`/students/${studentId}/submissions`),
  submitAssignment: (studentId, assignmentId, data) => api.post(`/students/${studentId}/assignments/${assignmentId}/submit`, data),
  updateProfile: (id, data) => api.put(`/students/${id}`, data),
  addSkill: (id, skillId, skillName, proficiency) => api.post(`/students/${id}/skills`, { skillId, skillName, proficiency }),
  removeSkill: (skillId) => api.delete(`/students/skills/${skillId}`),
  addProject: (id, project) => api.post(`/students/${id}/projects`, project),
  deleteProject: (projectId) => api.delete(`/students/projects/${projectId}`),
  addCertification: (id, cert) => api.post(`/students/${id}/certifications`, cert),
  deleteCertification: (certId) => api.delete(`/students/certifications/${certId}`),
  addInternship: (id, internship) => api.post(`/students/${id}/internships`, internship),
  deleteInternship: (internshipId) => api.delete(`/students/internships/${internshipId}`),
  saveResume: (id, data) => api.post(`/students/${id}/resume`, data),
  getResumes: (id) => api.get(`/students/${id}/resumes`),
  getRecommendations: (id) => api.get(`/students/${id}/recommendations`),
};

export const jobService = {
  getAll: (status) => api.get(`/jobs${status ? `?status=${status}` : ''}`),
  getById: (id) => api.get(`/jobs/${id}`),
  getCompanyJobs: (companyId) => api.get(`/jobs/company/${companyId}`),
  create: (companyId, job, driveId) => api.post(`/jobs/company/${companyId}${driveId ? `?driveId=${driveId}` : ''}`, job),
  update: (id, job) => api.put(`/jobs/${id}`, job),
  approve: (id, approve) => api.patch(`/jobs/${id}/approval`, { approve }),
  delete: (id) => api.delete(`/jobs/${id}`),
};

export const placementDriveService = {
  getAll: (status) => api.get(`/placement-drives${status ? `?status=${status}` : ''}`),
  getById: (id) => api.get(`/placement-drives/${id}`),
  create: (companyId, drive) => api.post(`/placement-drives/company/${companyId}`, drive),
  update: (id, drive) => api.put(`/placement-drives/${id}`, drive),
  delete: (id) => api.delete(`/placement-drives/${id}`),
};

export const companyService = {
  getMyProfile: () => api.get('/company/profile'),
  updateMyProfile: (profile) => api.put('/company/profile', profile),
  getPublicCompanies: () => api.get('/public/companies'),
};

export const applicationService = {
  apply: (jobId, coverNote) => api.post('/applications/apply', { jobId, coverNote }),
  getMyApplications: () => api.get('/applications/student/me'),
  getStudentApplications: (studentId) => api.get(`/applications/student/${studentId}`),
  getJobApplications: (jobId) => api.get(`/applications/job/${jobId}`),
  getCompanyApplications: (companyId) => api.get(`/applications/company/${companyId}`),
  getMyCompanyApplications: () => api.get('/applications/company/me'),
  getById: (id) => api.get(`/applications/${id}`),
  updateStatus: (id, status, feedback) => api.patch(`/applications/${id}/status`, { status, feedback }),
  scheduleInterview: (id, interview) => api.post(`/applications/${id}/interviews`, interview),
  getStudentInterviews: (studentId) => api.get(`/applications/student/${studentId}/interviews`),
  getCompanyInterviews: (companyId) => api.get(`/applications/company/${companyId}/interviews`),
};

export const candidateMatchingService = {
  matchCandidatesForJob: (jobId) => api.get(`/candidates/match/${jobId}`),
  matchSingleCandidate: (jobId, studentId) => api.get(`/candidates/match/${jobId}/student/${studentId}`),
};

export const taskService = {
  getStudentTasks: (studentId) => api.get(`/tasks/student/${studentId}`),
  getDailyTasks: (studentId, date) => api.get(`/tasks/student/${studentId}/daily${date ? `?date=${date}` : ''}`),
  getTaskSummary: (studentId) => api.get(`/tasks/student/${studentId}/summary`),
  createTask: (studentId, task) => api.post(`/tasks/student/${studentId}`, task),
  toggleTask: (taskId) => api.patch(`/tasks/${taskId}/toggle`),
  updateTask: (taskId, task) => api.put(`/tasks/${taskId}`, task),
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
};

export const teacherService = {
  getByUserId: (userId) => api.get(`/teacher/user/${userId}`),
  getDepartmentStudents: (deptId) => api.get(`/teacher/department/${deptId}/students`),
  recordAttendance: (teacherId, data) => api.post(`/teacher/${teacherId}/attendance`, data),
  getStudentAttendance: (studentId) => api.get(`/teacher/student/${studentId}/attendance`),
  createAssignment: (teacherId, assignment) => api.post(`/teacher/${teacherId}/assignments`, assignment),
  getTeacherAssignments: (teacherId) => api.get(`/teacher/${teacherId}/assignments`),
  getDepartmentAssignments: (deptId) => api.get(`/teacher/assignments/department/${deptId}`),
  submitAssignment: (assignmentId, studentId, data) => api.post(`/teacher/assignments/${assignmentId}/submit/${studentId}`, data),
  getAssignmentSubmissions: (assignmentId) => api.get(`/teacher/assignments/${assignmentId}/submissions`),
  getStudentSubmissions: (studentId) => api.get(`/teacher/student/${studentId}/submissions`),
  gradeSubmission: (submissionId, marks, feedback) => api.patch(`/teacher/submissions/${submissionId}/grade`, { marks, feedback }),
  uploadStudyMaterial: (teacherId, material) => api.post(`/teacher/${teacherId}/study-materials`, material),
  getAllStudyMaterials: () => api.get('/teacher/study-materials'),
};

export const placementCellService = {
  getCompanies: (approved) => api.get(`/placement/companies${approved !== undefined ? `?approved=${approved}` : ''}`),
  approveCompany: (companyId, approve) => api.patch(`/placement/companies/${companyId}/approve`, { approve }),
  getAllApplications: () => api.get('/placement/applications'),
  getAllInterviews: () => api.get('/placement/interviews'),
  getAllResults: () => api.get('/placement/results'),
};

export const adminService = {
  getUsers: () => api.get('/admin/users'),
  toggleUser: (userId) => api.patch(`/admin/users/${userId}/toggle`),
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (dept) => api.post('/admin/departments', dept),
  getCourses: () => api.get('/admin/courses'),
  createCourse: (deptId, course) => api.post(`/admin/departments/${deptId}/courses`, course),
  getBatches: () => api.get('/admin/batches'),
  createBatch: (batch, deptId) => api.post(`/admin/batches${deptId ? `?deptId=${deptId}` : ''}`, batch),
  getSkills: () => api.get('/admin/skills'),
  createSkill: (skill) => api.post('/admin/skills', skill),
};

export const analyticsService = {
  getDashboardStats: (studentId) => api.get(`/analytics/dashboard${studentId ? `?studentId=${studentId}` : ''}`),
};

export const notificationService = {
  getUserNotifications: (userId) => api.get(`/notifications/user/${userId}`),
  getUnreadCount: (userId) => api.get(`/notifications/user/${userId}/unread-count`),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: (userId) => api.patch(`/notifications/user/${userId}/read-all`),
};

export const announcementService = {
  getAll: (role) => api.get(`/announcements${role ? `?role=${role}` : ''}`),
  create: (announcement, deptId) => api.post(`/announcements${deptId ? `?departmentId=${deptId}` : ''}`, announcement),
  delete: (id) => api.delete(`/announcements/${id}`),
};

export const publicService = {
  getStats: () => api.get('/public/stats'),
  getCompanies: () => api.get('/public/companies'),
  getFeaturedJobs: () => api.get('/public/featured-jobs'),
  getUpcomingDrives: () => api.get('/public/upcoming-drives'),
  getDepartments: () => api.get('/public/departments'),
  submitContact: (data) => api.post('/public/contact', data),
};

export const aiService = {
  chat: (data) => api.post('/ai/chat', data),
  getMockQuestions: (roleCategory, roundType, count = 3) =>
    api.get(`/ai/mock-interview/questions?roleCategory=${encodeURIComponent(roleCategory)}&roundType=${encodeURIComponent(roundType)}&count=${count}`),
  evaluateMockAnswer: (data) => api.post('/ai/mock-interview/evaluate', data),
  polishResumeBullet: (text, roleTarget) => api.post('/ai/resume/polish', { text, roleTarget }),
  generateSummary: (data) => api.post('/ai/resume/summary', data),
  getKeywords: (targetRole) => api.get(`/ai/resume/keywords?targetRole=${encodeURIComponent(targetRole)}`),
  generateJob: (data) => api.post('/ai/job/generate', data),
  generateCandidateQuestions: (data) => api.post('/ai/candidate/questions', data),
};

export default api;
