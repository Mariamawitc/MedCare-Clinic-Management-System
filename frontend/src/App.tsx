import { Routes, Route, Navigate } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import MainLayout from './layouts/MainLayout';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <MainLayout>
        <Routes>
          <Route path="/*" element={<AppRoutes />} />
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </MainLayout>
    </AuthProvider>
  );
}

export default App;
