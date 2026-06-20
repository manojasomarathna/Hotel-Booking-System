import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, LogOut, User, LayoutDashboard, BedDouble } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-amber-400">
            <Hotel size={28} />
            <span>LuxeStay</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/rooms" className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors text-sm font-medium">
              <BedDouble size={16} />
              Rooms
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors text-sm font-medium">
                    <LayoutDashboard size={16} />
                    Admin
                  </Link>
                )}
                <Link to="/my-bookings" className="flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors text-sm font-medium">
                  <User size={16} />
                  My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-300 hover:text-white text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-amber-500 hover:bg-amber-600 px-4 py-1.5 rounded-lg text-sm font-medium text-slate-900 transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
