import { Routes, Route, Navigate } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/*" element={<AppRoutes />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
