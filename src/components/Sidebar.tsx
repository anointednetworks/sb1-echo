import { Link, useNavigate } from 'react-router-dom';
import { Home, User, LogOut, Megaphone } from 'lucide-react';
import { useAuthStore } from '../lib/store';
import { authService } from '../lib/services/auth';
import ThemeToggle from './ThemeToggle';
import toast from 'react-hot-toast';

export default function Sidebar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      navigate('/auth');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <div className="flex flex-col space-y-6">
        <Link to="/" className="flex items-center space-x-2 text-blue-500">
          <Megaphone className="w-8 h-8" />
          <span className="text-xl font-bold">Echo</span>
        </Link>
        
        <nav className="space-y-4">
          <Link
            to="/"
            className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <Home className="w-6 h-6" />
            <span>Home</span>
          </Link>
          
          <Link
            to="/profile"
            className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <User className="w-6 h-6" />
            <span>Profile</span>
          </Link>
          
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
          >
            <LogOut className="w-6 h-6" />
            <span>Sign Out</span>
          </button>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </div>
  );
}