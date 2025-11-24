import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Plus, ChevronDown, LayoutDashboard, User } from 'lucide-react';

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  // Helper to get initials if photo is missing
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* --- Logo Section --- */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg group-hover:bg-indigo-700 transition">
              <span className="font-bold text-lg tracking-tighter">BK</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 group-hover:text-indigo-600 transition">
              Bio<span className="text-indigo-600">Keeper</span>
            </h1>
          </Link>

          {/* --- Actions Section --- */}
          {user && (
            <div className="flex items-center gap-4">
              
              {/* Navigation Links */}
              <Link 
                to="/dashboard" 
                className="hidden md:flex items-center gap-1 text-gray-500 hover:text-indigo-600 font-medium transition"
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              <Link 
                to="/create" 
                className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-full font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg transition transform active:scale-95"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Add Bio</span>
              </Link>

              <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

              {/* --- User Profile Dropdown --- */}
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 focus:outline-none group"
                >
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition">
                      {user.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-400">View Profile</p>
                  </div>

                  <div className="relative">
                    {user.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-indigo-200 transition" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm">
                        {getInitials(user.displayName)}
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                         <ChevronDown size={12} className="text-gray-500" />
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="px-4 py-2 border-b border-gray-100 mb-2">
                        <p className="text-sm font-bold text-gray-800">{user.displayName || "User"}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User size={16} /> My Account
                    </Link>
                    
                    <button 
                      onClick={handleLogout} 
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left mt-1"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Click outside to close dropdown overlay (invisible) */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;