import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubmitRequest from './pages/SubmitRequest';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Register from './pages/Register';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 pb-10">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Citizen Routes */}
          <Route element={<ProtectedRoute allowedRole="CITIZEN" />}>
            <Route path="/dashboard" element={<CitizenDashboard />} />
            <Route path="/submit-request" element={<SubmitRequest />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRole="ADMIN" />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
