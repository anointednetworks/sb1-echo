import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TrendingTopics from './TrendingTopics';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 py-8">
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
          <main className="lg:col-span-2">
            <Outlet />
          </main>
          <div className="hidden lg:block lg:col-span-1">
            <TrendingTopics />
          </div>
        </div>
      </div>
    </div>
  );
}