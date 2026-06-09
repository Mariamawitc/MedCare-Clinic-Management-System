import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import PatientDashboard from '../pages/patient/PatientDashboard';
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import ReceptionistDashboard from '../pages/receptionist/ReceptionistDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => (
  <Routes>
    <Route path="auth/login" element={<Login />} />
    <Route path="auth/register" element={<Register />} />

    <Route
      path="patient"
      element={<ProtectedRoute allowedRoles={["patient"]}><PatientDashboard /></ProtectedRoute>}
    />
    <Route
      path="doctor"
      element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>}
    />
    <Route
      path="receptionist"
      element={<ProtectedRoute allowedRoles={["receptionist"]}><ReceptionistDashboard /></ProtectedRoute>}
    />
    <Route
      path="admin"
      element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>}
    />

    <Route path="" element={<Navigate to="/auth/login" replace />} />
  </Routes>
);

export default AppRoutes;
