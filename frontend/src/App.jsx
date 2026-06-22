import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import CreateAssignmentPage from './pages/CreateAssignmentPage.jsx';
import EvaluationResultPage from './pages/EvaluationResultPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import StudentDashboardPage from './pages/StudentDashboardPage.jsx';
import SubmitAnswerPage from './pages/SubmitAnswerPage.jsx';
import TeacherDashboardPage from './pages/TeacherDashboardPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/teacher" element={<TeacherDashboardPage />} />
          <Route path="/teacher/assignments/new" element={<CreateAssignmentPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['student']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/student" element={<StudentDashboardPage />} />
          <Route path="/student/assignments/:assignmentId/submit" element={<SubmitAnswerPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['teacher', 'student']} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/evaluations/:submissionId" element={<EvaluationResultPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
