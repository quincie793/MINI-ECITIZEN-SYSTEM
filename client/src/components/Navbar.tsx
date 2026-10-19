import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LogOut,
  Home,
  PlusCircle,
  ShieldAlert,
  LayoutDashboard,
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 bg-blue-600 px-6 py-4 text-white shadow-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Link
          to={user.role === 'ADMIN' ? '/admin-dashboard' : '/dashboard'}
          className="flex items-center gap-2 text-xl font-bold hover:opacity-90"
        >
          <ShieldAlert size={24} />
          <span>Mini eCitizen</span>
        </Link>

        <div className="flex items-center gap-6">
          {user.role === 'CITIZEN' ? (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1 transition-colors hover:text-blue-200"
              >
                <Home size={18} /> My Requests
              </Link>
              <Link
                to="/submit-request"
                className="flex items-center gap-1 transition-colors hover:text-blue-200"
              >
                <PlusCircle size={18} /> New Request
              </Link>
            </>
          ) : (
            <Link
              to="/admin-dashboard"
              className="flex items-center gap-1 transition-colors hover:text-blue-200"
            >
              <LayoutDashboard size={18} /> Admin Dashboard
            </Link>
          )}

          <div className="flex items-center gap-4 border-l border-blue-500 pl-6">
            <span className="text-sm">
              Hello, <span className="font-semibold">{user.name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 rounded bg-red-500 px-3 py-1.5 text-sm shadow-sm transition-colors hover:bg-red-600"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
